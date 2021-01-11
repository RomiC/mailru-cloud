import { IncomingHttpHeaders } from 'http';
import { parse as parseUrl } from 'url';

interface ICookieMeta {
  expires: string;
  domain: string;
  path: string;

  [key: string]: string | number | boolean;
}

interface ICookie {
  name: string;
  value: string;
  meta: ICookieMeta
}

/**
 * Filter cookies for the requested url
 *
 * @param url URL
 * @param cookies Array of cookies
 * @return Return string of filtered cookies
 */
export default function filterIncomingCookies(
  url: string,
  cookies: IncomingHttpHeaders['set-cookie']
): string {
  if (!cookies) {
    return '';
  }

  const { hostname: domain, pathname: path } = parseUrl(url);
  const prefixDomain = `.${domain}`;

  return cookies
    .reduce((res, cookie) => {
      const [nameValue, ...metaList] = cookie.split(';');
      const metaMap = metaList.reduce((r, meta) => {
        const [name, value] = meta.split('=');

        r[name.trim().toLowerCase()] = value || true;

        return r;
      }, {} as ICookieMeta);

      // Check if cookie hasn't being expired yet
      if (metaMap.expires != null && new Date(metaMap.expires) < new Date()) {
        return res;
      }

      // Check if cookie is fine for current domain
      if (
        metaMap.domain != null &&
        prefixDomain.indexOf(metaMap.domain) + metaMap.domain.length !== prefixDomain.length
      ) {
        return res;
      }

      // Check if cookie is appropriate for the current path
      if (metaMap.path != null && path.indexOf(metaMap.path) !== 0) {
        return res;
      }

      res.push(nameValue);

      return res;
    }, [] as string[])
    .join(';');
}