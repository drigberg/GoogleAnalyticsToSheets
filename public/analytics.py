"""Hello Analytics Reporting API V4."""

from apiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials
import sys
import os
import json

SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
KEY_FILE_LOCATION = os.path.dirname(os.path.abspath(__file__)) + '/../analytics_key.json'
VIEW_ID = sys.argv[1]

def initialize_analyticsreporting():
    """Initializes an Analytics Reporting API V4 service object.

    Returns:
        An authorized Analytics Reporting API V4 service object.
    """
    credentials = ServiceAccountCredentials.from_json_keyfile_name(
        KEY_FILE_LOCATION, SCOPES)

    # Build the service object.
    analytics = build('analyticsreporting', 'v4', credentials=credentials)

    return analytics

def get_report(analytics):
    """Queries the Analytics Reporting API V4.

    Args:
        analytics: An authorized Analytics Reporting API V4 service object.
    Returns:
        The Analytics Reporting API V4 response.
    """

    metricsInput = sys.argv[2].split("-")
    dimensionsInput = sys.argv[3].split("-")
    dateStart = sys.argv[4]
    dateEnd = sys.argv[5]

    metrics = []
    dimensions = []

    for i in range(len(metricsInput)):
        expression = 'ga:' + metricsInput[i]
        metrics.append({'expression': expression})

    for i in range(len(dimensionsInput)):
        name = 'ga:' + dimensionsInput[i]
        dimensions.append({'name': name})

    return analytics.reports().batchGet(
        body={
            'reportRequests': [
            {
                'viewId': VIEW_ID,
                'dateRanges': [{'startDate': dateStart, 'endDate': dateEnd}],
                'metrics': metrics,
                'dimensions': dimensions
            }]
        }
    ).execute()

def main():
    analytics = initialize_analyticsreporting()
    response = get_report(analytics)
    print json.dumps(response).replace("'", "\\'")

if __name__ == '__main__':
    main()
