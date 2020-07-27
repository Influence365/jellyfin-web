import ActivityLog from 'components/activitylog';
import globalize from 'globalize';

export default function (view, params) {
    let activityLog;

    if (params.useractivity !== 'false') {
        view.querySelector('.activityItems').setAttribute('data-useractivity', 'true');
        view.querySelector('.sectionTitle').innerHTML = globalize.translate('HeaderActivity');
    } else {
        view.querySelector('.activityItems').setAttribute('data-useractivity', 'false');
        view.querySelector('.sectionTitle').innerHTML = globalize.translate('Alerts');
    }

    view.addEventListener('viewshow', function () {
        if (!activityLog) {
            activityLog = new ActivityLog({
                serverId: ApiClient.serverId(),
                element: view.querySelector('.activityItems')
            });
        }
    });
    view.addEventListener('viewdestroy', function () {
        if (activityLog) {
            activityLog.destroy();
        }

        activityLog = null;
    });
}

