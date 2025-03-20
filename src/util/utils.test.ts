import { calculateAspectRatio } from './aspectratio';
import { createPackageUrl } from './string';
import { timestampToSeconds } from './time';

describe('time utils', () => {
  it('deserializes timestamps correctly', () => {
    let timestamp = '00:00:15';
    let parsed = timestampToSeconds(timestamp);
    expect(parsed).toBe(15);

    timestamp = '00:01:00';
    parsed = timestampToSeconds(timestamp);
    expect(parsed).toBe(60);

    timestamp = '01:00:00';
    parsed = timestampToSeconds(timestamp);
    expect(parsed).toBe(3600);

    timestamp = '00:01:45';
    parsed = timestampToSeconds(timestamp);
    expect(parsed).toBe(105);
  });
});

describe('aspect ratio utils', () => {
  it('calculates aspect ratios correctly', () => {
    let width = 1920;
    let height = 1080;
    let aspectRatio = calculateAspectRatio(width, height);
    expect(aspectRatio).toBe('16:9');

    width = 1280;
    height = 720;
    aspectRatio = calculateAspectRatio(width, height);
    expect(aspectRatio).toBe('16:9');

    width = 640;
    height = 480;
    aspectRatio = calculateAspectRatio(width, height);
    expect(aspectRatio).toBe('4:3');

    width = 3840;
    height = 2160;
    aspectRatio = calculateAspectRatio(width, height);
    expect(aspectRatio).toBe('16:9');
  });
});

describe('string utils', () => {
  it('constructs a package URL correctly', () => {
    const expected = 'http://test-server.com/test-folder/test-base.m3u8';
    const actual = createPackageUrl(
      'http://test-Server.com',
      'test-folder',
      'test-base'
    );
    expect(actual).toBe(expected);
  });
});
