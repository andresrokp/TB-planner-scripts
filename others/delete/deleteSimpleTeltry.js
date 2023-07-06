
require('dotenv').config()

/**
 * Delete device's telemetries with thingsboard API
 * @param {string} entityType - The entity type (e.g., 'DEVICE').
 * @param {string} entityId - The entity ID.
 * @param {string} keys - Comma-separated list of telemetry keys.
 * @param {boolean} deleteAllDataForKeys - Specifies if all data for selected keys should be deleted.
 * @param {number} startTs - The start timestamp of the removal time range in milliseconds.
 * @param {number} endTs - The end timestamp of the removal time range in milliseconds.
 * @param {boolean} rewriteLatestIfDeleted - Specifies if the latest telemetry should be rewritten if it was removed.
 * @param {string} authorizationToken - The authorization token.
 * @returns {Promise} A promise that resolves with the API response.
 */
async function deleteTelemetry(
  entityType,
  entityId,
  keys,
  deleteAllDataForKeys,
  startTs,
  endTs,
  rewriteLatestIfDeleted,
  authorizationToken
) {
    let url = `https://${process.env.TB_DNS}/api/plugins/telemetry/${entityType}/${entityId}/timeseries/delete?keys=${encodeURIComponent(keys)}&deleteAllDataForKeys=${deleteAllDataForKeys}&rewriteLatestIfDeleted=${rewriteLatestIfDeleted}`;
    if (deleteAllDataForKeys != true){
        startTs = new Date(startTs).getTime()
        endTs = new Date(endTs).getTime()
        url += `&startTs=${startTs}&endTs=${endTs}`
    }
    const headers = {
        Accept: "application/json",
        "X-Authorization": `Bearer ${authorizationToken}`,
    };

    console.log({
        url,
        info: {
            method: "DELETE",
            headers: headers,
        }
    });

    const response = await fetch(url, {
        method: "DELETE",
        headers: headers,
    });

    console.log(response);

    if (response.ok) {
        return response;
    } else {
        throw new Error(
            `Failed to delete telemetry: ${response.status} ${response.statusText}`
        );
    }
}


//---------------------------
// main execution

console.log('-----\n----------------------------------\n-----');

// valores
const entityType = 'DEVICE';
const entityId = process.env.CURRENT_ENTITY_ID;
const keys = 'axisX,axisY,axisZ';
const allKeys = Array(process.env.TEL_KEY_LIST.replaceAll("\'","")).join(',')
const deleteAllDataForKeys = true;
const startTs = 'Jul 07 2023 12:49:00';
const endTs = 'Jul 07 2023 12:50:39';
const rewriteLatestIfDeleted = true;
const authorizationToken = process.env.CURRENT_BEARER_TOKEN; // Example authorization token

deleteTelemetry(entityType, entityId, allKeys, deleteAllDataForKeys, startTs, endTs, rewriteLatestIfDeleted, authorizationToken)
.then(response => {
    console.log(response);
    console.log('Telemetry deleted successfully')
})
.catch(e => {
    console.log(e);
    console.log('Error on deletion')
})
