
import type { AsyncDataOptions } from '#app';
import { $fetch, type FetchOptions } from 'ofetch';

// locals
import FetchFactory from '../factory';
import AuthModule from './auth';

type IVideo = {
  "id": string,
  "stream_id": string,
  "user_id": string,
  "user_login": string,
  "user_name": string,
  "title": string,
  "description": "",
  "created_at": string,
  "published_at": string,
  "url": string,
  "thumbnail_url": string,
  "viewable": string,
  "view_count": number,
  "language": string,
  "type": string,
  "duration": string,
  "muted_segments"?: string[]
}

type IResponse = {
  data: IVideo[];
}

class VideosModule extends FetchFactory<IResponse[]> {
  private RESOURCE = '/videos';

  /**
   * Gets a list of a users video 
   * @param asyncDataOptions options for `useAsyncData`
   * @returns 
   */
  async getVideosList(
    asyncDataOptions?: AsyncDataOptions<IResponse[]>
  ) {

    const config = useRuntimeConfig()

    const { data } = await new AuthModule($fetch.create({ baseURL: config.public.auth_twitch_base_url })).getToken()


    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {
          headers: {
            'Authorization': `Bearer ${data.value?.access_token}`,
            'Client-Id': config.public.client_id
          }
        };
        return this.call(
          'GET',
          `${this.RESOURCE}?user_id=${config.public.user_id}`,
          undefined, // body
          fetchOptions
        )
      },
      asyncDataOptions
    )
  }
}

export default VideosModule;