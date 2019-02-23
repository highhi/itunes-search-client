import qs from 'qs'

const BASE_PATH = 'https://itunes.apple.com/search'

export type Media =
  | 'movie'
  | 'music'
  | 'podcast'
  | 'music'
  | 'musicVideo'
  | 'audiobook'
  | 'shortFilm'
  | 'tvShow'
  | 'software'
  | 'ebook'
  | 'all'

export type Entity = {
  movie: 'movieArtist' | 'movie'
  podcast: 'podcastAuthor' | 'podcast'
  music: 'musicArtist' | 'musicTrack' | 'album' | 'musicVideo' | 'mix' | 'song'
  musicVideo: 'musicArtist' | 'musicVideo'
  audiobook: 'audiobookAuthor'| 'audiobook'
  shortFilm: 'shortFilmArtist' | 'shortFilm'
  tvShow: 'tvEpisode' | 'tvSeason'
  software: 'software' | 'iPadSoftware' | 'macSoftware'
  ebook: 'ebook'
  all: 'movie' | 'album' | 'allArtist' | 'podcast' | 'musicVideo' | 'mix' | 'audiobook' | 'tvSeason' | 'allTrack'
}

export type Attribute = {
  movie: 'actorTerm' | 'genreIndex' | 'artistTerm' | 'shortFilmTerm' | 'producerTerm' | 'ratingTerm' | 'directorTerm' | 'releaseYearTerm' | 'featureFilmTerm' | 'movieArtistTerm' | 'movieTerm' | 'ratingIndex'|'descriptionTerm'
  podcast: 'titleTerm' | 'languageTerm' | 'authorTerm' | 'genreIndex' | 'artistTerm' | 'ratingIndex' | 'keywordsTerm' | 'descriptionTerm'
  music: 'mixTerm' | 'genreIndex' | 'artistTerm' | 'composerTerm' | 'albumTerm' | 'ratingIndex' | 'songTerm'
  musicVideo: 'genreIndex' | 'artistTerm' | 'albumTerm' | 'ratingIndex' | 'songTerm'
  audiobook: 'titleTerm' | 'authorTerm' | 'genreIndex' | 'ratingIndex'
  shortFilm: 'genreIndex' | 'artistTerm' | 'shortFilmTerm' | 'ratingIndex' | 'descriptionTerm'
  tvShow: 'genreIndex' | 'tvEpisodeTerm' | 'showTerm' | 'tvSeasonTerm' | 'ratingIndex' | 'descriptionTerm'
  software: 'softwareDeveloper'
  all: 'actorTerm' | 'languageTerm' | 'allArtistTerm' | 'tvEpisodeTerm' | 'shortFilmTerm' | 'directorTerm' | 'releaseYearTerm' | 'titleTerm' | 'featureFilmTerm' | 'ratingIndex' | 'keywordsTerm' | 'descriptionTerm' | 'authorTerm' | 'genreIndex' | 'mixTerm' | 'allTrackTerm' | 'artistTerm' | 'composerTerm' | 'tvSeasonTerm' | 'producerTerm' | 'ratingTerm' | 'songTerm' | 'movieArtistTerm' | 'showTerm' | 'movieTerm' | 'albumTerm'
}

export type ReturnEntity<T> =
  T extends 'movie' ? Entity['movie'] :
  T extends 'podcast' ? Entity['podcast'] :
  T extends 'music' ? Entity['music'] :
  T extends 'musicVideo' ? Entity['musicVideo'] :
  T extends 'audiobook' ? Entity['audiobook'] :
  T extends 'shortFilm' ? Entity['shortFilm'] :
  T extends 'tvShow' ? Entity['tvShow'] :
  T extends 'software' ? Entity['software'] :
  T extends 'ebook' ? Entity['ebook'] :
  T extends 'all' ? Entity['all'] :
  never

export type ReturnAttribute<T> =
  T extends 'movie' ? Attribute['movie'] :
  T extends 'podcast' ? Attribute['podcast'] :
  T extends 'music' ? Attribute['music'] :
  T extends 'musicVideo' ? Attribute['musicVideo'] :
  T extends 'audiobook' ? Attribute['audiobook'] :
  T extends 'shortFilm' ? Attribute['shortFilm'] :
  T extends 'tvShow' ? Attribute['tvShow'] :
  T extends 'software' ? Attribute['software'] :
  T extends 'all' ? Attribute['all'] :
  never

export type Params<MediaType> = {
  entity?: ReturnEntity<MediaType>
  attribute?: ReturnAttribute<MediaType>
  media: Media
  limit: number
  term: string
  lang: string
  country: string
}

class ItunseClient<MediaType> {
  constructor(private params: Params<MediaType>) {}

  getParams = (): Params<MediaType> => {
    return { ...this.params }
  }

  getPath = (): string => {
    const queries = qs.stringify(this.getParams())
    return `${BASE_PATH}?${queries}`
  }

  entity = (value: ReturnEntity<MediaType>): ItunseClient<MediaType> => {
    return this.create('entity', value)
  }

  attribute = (value: ReturnAttribute<MediaType>): ItunseClient<MediaType> => {
    return this.create('attribute', value)
  }

  limit = (value: number): ItunseClient<MediaType> => {
    return this.create('limit', value)
  }

  send = (options?: Request): Promise<Response> => {
    return fetch(new Request(this.getPath(), { ...options, method: 'GET' }))
  }

  private create = <Key extends keyof Params<MediaType>>(key: Key, value: Params<MediaType>[Key]) => {
    return new ItunseClient({ ...this.params, [key]: value })
  }
}

type Options = {
  limit?: number
  lang?: string
  country?: string
}

export default function itunseSearch(term: string, options: Options = {}) {
  return {
    media<M extends Media>(value: M) {
      const params: Params<M> = Object.create(null)
      params['term'] = term
      params['media'] = value
      params['limit'] = options.limit || 10
      params['lang'] = options.lang || 'en_us'
      params['country'] = options.country || 'en'
    
      return new ItunseClient(params)
    }
  }
}
