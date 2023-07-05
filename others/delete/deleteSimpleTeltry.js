



//------------------------------
//------------------------------

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
async function deleteTelemetry(entityType, entityId, keys, deleteAllDataForKeys, startTs, endTs, rewriteLatestIfDeleted, authorizationToken) {
    const url = `https://api.sighums.com/api/plugins/telemetry/${entityType}/${entityId}/timeseries/delete
                ?keys=${encodeURIComponent(keys)}&deleteAllDataForKeys=${deleteAllDataForKeys}
                &rewriteLatestIfDeleted=${rewriteLatestIfDeleted}`;
    deleteAllDataForKeys == false ? url + `&startTs=123&endTs=456`:null;
    const headers = {
      'Accept': 'application/json',
      'X-Authorization': `Bearer ${authorizationToken}`,
    };
  
    const response = await fetch(url, {
      method: 'DELETE',
      headers: headers,
    });
  
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error(`Failed to delete telemetry: ${response.status} ${response.statusText}`);
    }
  }