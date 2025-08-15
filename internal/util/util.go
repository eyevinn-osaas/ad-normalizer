package util

import (
	"net/url"
	"regexp"
	"strconv"
	"strings"

	"github.com/Eyevinn/VMAP/vmap"
	"github.com/Eyevinn/ad-normalizer/internal/structure"
	"github.com/google/uuid"
)

func GetBestMediaFileFromVastAd(ad *vmap.Ad) *vmap.MediaFile {
	bestMediaFile := &vmap.MediaFile{}
	for _, c := range ad.InLine.Creatives {
		for _, m := range c.Linear.MediaFiles {
			if m.Bitrate > bestMediaFile.Bitrate {
				bestMediaFile = &m
			}
		}
	}
	return bestMediaFile
}

func GetCreatives(
	vast *vmap.VAST,
	keyField string,
	keyRegex string,
) map[string]structure.ManifestAsset {
	creatives := make(map[string]structure.ManifestAsset, len(vast.Ad))
	for _, ad := range vast.Ad {
		mediaFile := GetBestMediaFileFromVastAd(&ad)
		adId := getKey(keyField, keyRegex, &ad, mediaFile)
		creatives[adId] = structure.ManifestAsset{
			CreativeId:        adId,
			MasterPlaylistUrl: mediaFile.Text,
		}
	}

	return creatives
}

func getKey(keyField, keyRegex string, ad *vmap.Ad, mediaFile *vmap.MediaFile) string {
	var res string
	switch keyField {
	case "resolution":
		res = strconv.Itoa(mediaFile.Width) + "x" + strconv.Itoa(mediaFile.Height)
	case "url":
		re := regexp.MustCompile(keyRegex)
		res = re.ReplaceAllString(mediaFile.Text, "")
	default:
		re := regexp.MustCompile(keyRegex)
		res = re.ReplaceAllString(ad.InLine.Creatives[0].UniversalAdId.Id, "")
	}
	return res
}

func ConvertToAssetDescriptionSlice(vast *vmap.VAST) []structure.AssetDescription {
	// the vast is pre-fitlered, should be the same size
	descriptions := make([]structure.AssetDescription, len(vast.Ad))
	for idx, ad := range vast.Ad {
		mediaFile := GetBestMediaFileFromVastAd(&ad)
		descriptions[idx] = convertToAssetDescription(mediaFile, getAdDuration(ad))
	}
	return descriptions
}

func getAdDuration(ad vmap.Ad) vmap.Duration {
	if len(ad.InLine.Creatives) == 0 || ad.InLine.Creatives[0].Linear == nil {
		return vmap.Duration{}
	}
	return ad.InLine.Creatives[0].Linear.Duration
}

func convertToAssetDescription(mediaFile *vmap.MediaFile, duration vmap.Duration) structure.AssetDescription {
	return structure.AssetDescription{
		Uri:      mediaFile.Text,
		Duration: duration.Seconds(),
	}
}

func ReplaceMediaFiles(
	vast *vmap.VAST,
	assets map[string]structure.ManifestAsset,
	keyRegex string,
	keyField string,
) error {
	newAds := make([]vmap.Ad, 0, len(vast.Ad))
	for _, ad := range vast.Ad {
		mediaFile := GetBestMediaFileFromVastAd(&ad)
		adId := getKey(keyField, keyRegex, &ad, mediaFile)
		if asset, found := assets[adId]; found {
			newAd := ad
			newMediaFile := *mediaFile // Copy to overwrite
			newMediaFile.Text = asset.MasterPlaylistUrl
			newMediaFile.MediaType = "application/x-mpegURL"
			newAd.InLine.Creatives[0].Linear.MediaFiles = []vmap.MediaFile{
				newMediaFile,
			}
			newAds = append(newAds, newAd)
		}
	}
	vast.Ad = newAds
	return nil
}

func CreateOutputUrl(bucket url.URL, folder string) string {
	newPath := bucket.JoinPath(folder, uuid.New().String(), "/")
	return newPath.String()
}

// ReplaceSubdomain replaces the subdomain of a URL with a new subdomain.
// if the URL has no subdomain, it adds the new subdomain before the existing host.
func ReplaceSubdomain(start url.URL, subdomain string) url.URL {
	hostParts := strings.Split(start.Host, ".")
	if len(hostParts) > 2 {
		hostParts[0] = subdomain
		start.Host = strings.Join(hostParts, ".")
	} else if len(hostParts) == 2 {
		hostParts = []string{subdomain, hostParts[0], hostParts[1]}
		start.Host = strings.Join(hostParts, ".")
	} else {
		hostParts = []string{subdomain, start.Host}
		start.Host = strings.Join(hostParts, ".")
	}
	return start

}
