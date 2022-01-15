# Gicon

> Grab favicons of sites using Google's favicon api.

## Why?

Google's favicon api contains redirects which means that not all application will be able to follow the redirects and acquire the favicons of the desired sites. This is a proxy that grabs the favicon of a site by following the redirects and responds with a single HTTP response.

## Usage

### Api endpoints

-   `https://gicon.vercel.app/?{param}={value}`
-   `https://gicon.netlify.app/.netlify/functions/api?{param}={value}`

| Param | Value    | Description                                                                                                               |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| _url_ | `string` | The site url or domain                                                                                                    |
| _sz_  | `number` | The size of the favicon e.g. 16, 32, 64, 128, 256.<br> **Default** is 256.<br> Note that it may not reach the exact size. |

### Examples

```
https://gicon.vercel.app/?url=google.com
```

```
https://gicon.vercel.app/?url=https://www.github.com
```

```
https://gicon.vercel.app/?sz=64&url=netlify.com
```

```
https://gicon.netlify.app/.netlify/functions/api?sz=128&url=youtube.com
```

```
https://gicon.netlify.app/.netlify/functions/api?url=google.com
```

## Libraries

-   [x] Express
-   [x] Serverless-http
-   [x] Axios
