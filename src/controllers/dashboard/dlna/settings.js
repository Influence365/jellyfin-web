import $ from 'jQuery';
import loading from 'loading';
import libraryMenu from 'libraryMenu';
import globalize from 'globalize';

function loadPage(page, config, users) {
    page.querySelector('#chkEnablePlayTo').checked = config.EnablePlayTo;
    page.querySelector('#chkEnableDlnaDebugLogging').checked = config.EnableDebugLog;
    $('#txtClientDiscoveryInterval', page).val(config.ClientDiscoveryIntervalSeconds);
    $('#chkEnableServer', page).prop('checked', config.EnableServer);
    $('#chkBlastAliveMessages', page).prop('checked', config.BlastAliveMessages);
    $('#txtBlastInterval', page).val(config.BlastAliveMessageIntervalSeconds);
    const usersHtml = users.map(function (u) {
        return '<option value="' + u.Id + '">' + u.Name + '</option>';
    }).join('');
    $('#selectUser', page).html(usersHtml).val(config.DefaultUserId || '');
    loading.hide();
}

function onSubmit() {
    loading.show();
    const form = this;
    ApiClient.getNamedConfiguration('dlna').then(function (config) {
        config.EnablePlayTo = form.querySelector('#chkEnablePlayTo').checked;
        config.EnableDebugLog = form.querySelector('#chkEnableDlnaDebugLogging').checked;
        config.ClientDiscoveryIntervalSeconds = $('#txtClientDiscoveryInterval', form).val();
        config.EnableServer = $('#chkEnableServer', form).is(':checked');
        config.BlastAliveMessages = $('#chkBlastAliveMessages', form).is(':checked');
        config.BlastAliveMessageIntervalSeconds = $('#txtBlastInterval', form).val();
        config.DefaultUserId = $('#selectUser', form).val();
        ApiClient.updateNamedConfiguration('dlna', config).then(Dashboard.processServerConfigurationUpdateResult);
    });
    return false;
}

function getTabs() {
    return [{
        href: 'dlnasettings.html',
        name: globalize.translate('TabSettings')
    }, {
        href: 'dlnaprofiles.html',
        name: globalize.translate('TabProfiles')
    }];
}

$(document).on('pageinit', '#dlnaSettingsPage', function () {
    $('.dlnaSettingsForm').off('submit', onSubmit).on('submit', onSubmit);
}).on('pageshow', '#dlnaSettingsPage', function () {
    libraryMenu.setTabs('dlna', 0, getTabs);
    loading.show();
    const page = this;
    const promise1 = ApiClient.getNamedConfiguration('dlna');
    const promise2 = ApiClient.getUsers();
    Promise.all([promise1, promise2]).then(function (responses) {
        loadPage(page, responses[0], responses[1]);
    });
});
