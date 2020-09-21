import * as functions from 'firebase-functions';
import got from 'got';

const LOCAL_SEARCH_KEYWORD_URL = 'https://dapi.kakao.com/v2/local/search/keyword.json';

export const searchLocation = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    throw new functions.https.HttpsError('unknown', 'NOT_ALLOWED_METHOD');
  }

  const kakaoRestApiKey = req.header('X-Kakao-Rest-Api-Key');
  if (!kakaoRestApiKey) {
    throw new functions.https.HttpsError('unknown', 'KAKAO_REST_API_KEY_REQUIRED');
  }

  const {keyword} = req.body.input;

  const {documents = []} = await got(LOCAL_SEARCH_KEYWORD_URL, {
    headers: {
      Authorization: `KakaoAK ${kakaoRestApiKey}`,
    },
    searchParams: {
      page: 1,
      query: keyword,
    }
  }).json()

  res.status(200).json(documents.map((doc: any) => ({
    id: doc.id,
    placeName: doc.place_name,
    address: doc.road_address_name,
    x: +doc.x,
    y: +doc.y,
  })))
})
