# Ad Normalizer

A Proxy put in fron of an ad server that dispatches transcoding and packaging of VAST creatives.

The service accepts requests to the endpoint `api/v1/vast`, and returns a JSON array with the following structure:

```json
{
  "assets": [
    {
      "creativeId": "abcd1234",
      "masterPlaylistUrl": "https://your-minio-endpoint/creativeId/substring/index.m3u8"
    }
  ]
}
```

The service uses redis to keep track of transcoded creatives, and returns the master playlist URL if one is found; if the service does not know of any packaged assets for a creative, it creates a transcoding and packaging pipeline, and monitors the provided minio bucket for asset uploads. Once the assets are in place, the master playlist URL is added to the redis cache.

## Requirements

To run the ad normalizer as a service, the following other services are needed

- A redis instance

A media processing pipeline consisting of the following:

- A running instance of [SVT Encore](https://github.com/svt/encore)
- A service that handles encore callbacks
- A packaging service to handle the transcoded files
- A minio bucket for the packaged assets

Such a pipeline can easily be created using [Eyevinn open source cloud](https://docs.osaas.io/osaas.wiki/Solution%3A-VOD-Transcoding.html)

Note: the ad normalizer assumes that your packager is set up with the output subfolder template `$EXTERNALID$/$JOBID$`

## Usage

### Environment variables

| Variable                | Description                                                                                                                | Default value |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `ENCORE_URL`            | The URL of your encore instance                                                                                            | none          |
| `CALLBACK_LISTENER_URL` | The URL of your callback listener                                                                                          | none          |
| `S3_ENDPOINT`           | The S3 instance endpoint endpoint                                                                                          | none          |
| `S3_ACCESS_KEY`         | Your S3 access key                                                                                                         | none          |
| `S3_SECRET_KEY`         | Your S3 secret key                                                                                                         | none          |
| `LOG_LEVEL`             | The log level of the service                                                                                               | Info          |
| `REDIS_URL`             | The url of your redis instance                                                                                             | none          |
| `AD_SERVER_URL`         | The url of your ad server                                                                                                  | none          |
| `PORT`                  | The port that the server listens on                                                                                        | 8000          |
| `OUTPUT_BUCKET_URL`     | The url to the output folder for the packaged assets                                                                       | none          |
| `SERVICE_ACCESS_TOKEN`  | your OSC service access token for encore (only needed when running the service outside OSC with an encore instance in OSC) | none          |

### starting the service

`npm run start`

## Development

When developing, it is highly recommended that you put the required variables in a dotenv file at the repository root. This will make it easier to iterate and change environment variables throughout the development process.
Before pushing changes to the repo, please run the following steps to make sure your pipeline will succeed:

- `npm run test` to verify that your changes do not break existing functionality (if adding features, it is good practice to also write tests).
- `npm run lint` as well as `npm run pretty` to ensure that the code still follows the formatting standards. Errors should be fixed, as the pipeline won't succeed otherwise. Warnings should be handled on a case-by-case basis. To format all files in the `src/` directory, run `npm run format`.

### Contributing

See [CONTRIBUTING](CONTRIBUTING.md)

# Support

Join our [community on Slack](http://slack.streamingtech.se) where you can post any questions regarding any of our open source projects. Eyevinn's consulting business can also offer you:

- Further development of this component
- Customization and integration of this component into your platform
- Support and maintenance agreement

Contact [sales@eyevinn.se](mailto:sales@eyevinn.se) if you are interested.

# About Eyevinn Technology

[Eyevinn Technology](https://www.eyevinntechnology.se) is an independent consultant firm specialized in video and streaming. Independent in a way that we are not commercially tied to any platform or technology vendor. As our way to innovate and push the industry forward we develop proof-of-concepts and tools. The things we learn and the code we write we share with the industry in [blogs](https://dev.to/video) and by open sourcing the code we have written.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!
