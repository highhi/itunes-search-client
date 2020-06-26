const BASE_PATH = 'https://itunes.apple.com/search'

export type Media = 'movie' | 'music' | 'podcast' | 'musicVideo' | 'audiobook' | 'shortFilm' | 'tvShow' | 'software' | 'ebook' | 'all'

export type Entity = {
  movie: 'movieArtist' | 'movie'
  podcast: 'podcastAuthor' | 'podcast'
  music: 'musicArtist' | 'musicTrack' | 'album' | 'musicVideo' | 'mix' | 'song'
  musicVideo: 'musicArtist' | 'musicVideo'
  audiobook: 'audiobookAuthor' | 'audiobook'
  shortFilm: 'shortFilmArtist' | 'shortFilm'
  tvShow: 'tvEpisode' | 'tvSeason'
  software: 'software' | 'iPadSoftware' | 'macSoftware'
  ebook: 'ebook'
  all: 'movie' | 'album' | 'allArtist' | 'podcast' | 'musicVideo' | 'mix' | 'audiobook' | 'tvSeason' | 'allTrack'
}

export type Attribute = {
  movie:
    | 'actorTerm'
    | 'genreIndex'
    | 'artistTerm'
    | 'shortFilmTerm'
    | 'producerTerm'
    | 'ratingTerm'
    | 'directorTerm'
    | 'releaseYearTerm'
    | 'featureFilmTerm'
    | 'movieArtistTerm'
    | 'movieTerm'
    | 'ratingIndex'
    | 'descriptionTerm'
  podcast: 'titleTerm' | 'languageTerm' | 'authorTerm' | 'genreIndex' | 'artistTerm' | 'ratingIndex' | 'keywordsTerm' | 'descriptionTerm'
  music: 'mixTerm' | 'genreIndex' | 'artistTerm' | 'composerTerm' | 'albumTerm' | 'ratingIndex' | 'songTerm'
  musicVideo: 'genreIndex' | 'artistTerm' | 'albumTerm' | 'ratingIndex' | 'songTerm'
  audiobook: 'titleTerm' | 'authorTerm' | 'genreIndex' | 'ratingIndex'
  shortFilm: 'genreIndex' | 'artistTerm' | 'shortFilmTerm' | 'ratingIndex' | 'descriptionTerm'
  tvShow: 'genreIndex' | 'tvEpisodeTerm' | 'showTerm' | 'tvSeasonTerm' | 'ratingIndex' | 'descriptionTerm'
  software: 'softwareDeveloper'
  all:
    | 'actorTerm'
    | 'languageTerm'
    | 'allArtistTerm'
    | 'tvEpisodeTerm'
    | 'shortFilmTerm'
    | 'directorTerm'
    | 'releaseYearTerm'
    | 'titleTerm'
    | 'featureFilmTerm'
    | 'ratingIndex'
    | 'keywordsTerm'
    | 'descriptionTerm'
    | 'authorTerm'
    | 'genreIndex'
    | 'mixTerm'
    | 'allTrackTerm'
    | 'artistTerm'
    | 'composerTerm'
    | 'tvSeasonTerm'
    | 'producerTerm'
    | 'ratingTerm'
    | 'songTerm'
    | 'movieArtistTerm'
    | 'showTerm'
    | 'movieTerm'
    | 'albumTerm'
  ebook: never
}

export type Params<MediaType extends Media> = {
  entity?: Entity[MediaType]
  attribute?: Attribute[MediaType]
  media: Media
  limit: number
  term: string
  lang: string
  country: string
}

function qs(params: { [key: string]: any }): string {
  return Object.keys(params)
    .map((key) => {
      const enkey = encodeURIComponent(key)
      const envalue = encodeURIComponent(params[key])
      return `${enkey}=${envalue}`
    })
    .join('&')
}

export type ItunesSearchClient<MediaType extends Media> = {
  getParams(): Params<MediaType>
  getUrl(): string
  entity(value: Entity[MediaType]): ItunesSearchClient<MediaType>
  attribute(value: Attribute[MediaType]): ItunesSearchClient<MediaType>
  limit(value: number): ItunesSearchClient<MediaType>
  send(options?: Request): Promise<Response>
}

class Client<MediaType extends Media> implements ItunesSearchClient<MediaType> {
  private params: Params<MediaType>

  constructor(params: Params<MediaType>) {
    this.params = params
  }

  getParams = () => {
    return { ...this.params }
  }

  getUrl = () => {
    const queries = qs(this.params)
    return `${BASE_PATH}?${queries}`
  }

  entity = (value: Entity[MediaType]) => {
    return this.create('entity', value)
  }

  attribute = (value: Attribute[MediaType]) => {
    return this.create('attribute', value)
  }

  limit = (value: number) => {
    return this.create('limit', value)
  }

  send = (options?: Request) => {
    return fetch(this.getUrl(), { ...options, method: 'GET' })
  }

  private create = <Key extends keyof Params<MediaType>>(key: Key, value: Params<MediaType>[Key]): ItunesSearchClient<MediaType> => {
    return new Client({ ...this.params, [key]: value })
  }
}

type Options = {
  limit?: number
  lang?: string
  country?: string
}

class ItunesSearch {
  private term = ''
  private options: Options = {}

  constructor(term: string, options: Options = {}) {
    this.term = term
    this.options = options
  }

  media = <M extends Media>(value: M): ItunesSearchClient<M> => {
    const params: Params<M> = Object.create(null)
    params['term'] = this.term
    params['media'] = value
    params['limit'] = this.options.limit || 10
    params['lang'] = this.options.lang || 'en_us'
    params['country'] = this.options.country || 'us'

    return new Client(params)
  }
}

export default function itunesSearch(term: string, options: Options = {}): ItunesSearch {
  return new ItunesSearch(term, options)
}

export { itunesSearch as isc }
