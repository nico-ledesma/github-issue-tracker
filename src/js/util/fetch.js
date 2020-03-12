import axios from 'axios';

/** */
export function get(path, params) {
  return axios.get(path, {
    baseURL: 'https://api.github.com/',
    timeout: 10000,
    params,
  });
}

/** */
export async function getCollection(path, params) {
  const args = {
    page: 1,
    per_page: 100,
    ...params,
  };

  const firstResponse = await get(path, args);
  const collection = firstResponse.data;
  const pagination = getPagination(firstResponse);

  let nextRequests = [];

  for (let page = 2; page < pagination.length; page++) {
    const newRequest = get(path, { ...args, page });
    nextRequests.push(newRequest);
  }

  const nextResponses = await Promise.all(nextRequests);

  nextResponses.forEach(response => collection.concat(response.data));

  return collection;
}

/** */
function getPagination(response) {
  // Non-paginated results
  if (!response.headers || !response.headers.link) {
    return { last: 1 };
  }

  return response.headers.link
    .split(',')
    .map(parseLinkHeaderChunk)
    .reduce((obj, link) => {
      obj[link.rel] = parseInt(link.page);

      return obj;
    }, {});
}

/** */
function parseLinkHeaderChunk(chunk) {
  const [pageChunk, relChunk] = chunk.split(';');

  const rel = /rel="(.+)"/.exec(relChunk)[1];

  // Match "page" but not "per_page" params
  const page = /[^_]page=(\d+)/.exec(pageChunk)[1];

  return { rel, page };
}
