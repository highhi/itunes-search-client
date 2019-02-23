import 'isomorphic-unfetch'
import isc from '../src'

// @ts-ignore
global.fetch = jest.fn()

describe('itunse-search-client', () => {
  describe('#getPath', () => {
    test('should return correct path', () => {
      let path
      path = isc('foo').media('movie').getPath()
      expect(path).toMatchSnapshot()
      path = isc('foo').media('movie').entity('movieArtist').getPath()
      expect(path).toMatchSnapshot()
      path = isc('foo').media('movie').entity('movieArtist').attribute('movieTerm').getPath()
      expect(path).toMatchSnapshot()
      path = isc('foo').media('movie').entity('movieArtist').attribute('movieTerm').limit(30).getPath()
      expect(path).toMatchSnapshot()
      path = isc('foo', { lang: 'ja_jp', country: 'jp' }).media('movie').entity('movieArtist').attribute('movieTerm').limit(30).getPath()
      expect(path).toMatchSnapshot()
    })
  })

  describe('#getParams', () => {
    let base: {}

    beforeEach(() => {
      base = { term: 'foo', lang: 'en_us', country: 'us', limit: 10, media: 'movie' }
    })

    describe('should return correct params', () => {
      test('base', () => {
        const params = isc('foo').media('movie').getParams()
        expect(params).toEqual(base)
      })

      test('when added an entity', () => {
        const params = isc('foo').media('movie').entity('movieArtist').getParams()
        expect(params).toEqual({ ...base, entity: 'movieArtist' })
      })

      test('when added an attribute', () => {
        const params = isc('foo').media('movie').attribute('genreIndex').getParams()
        expect(params).toEqual({ ...base, attribute: 'genreIndex' })
      })

      test('when added an limit', () => {
        const params = isc('foo').media('movie').limit(40).getParams()
        expect(params).toEqual({ ...base, limit: 40 })
      })

      test('when added an options', () => {
        const params = isc('foo', { lang: 'ja_jp', country: 'jp' }).media('movie').getParams()
        expect(params).toEqual({ ...base, lang: 'ja_jp', country: 'jp' })
      })
    })

    test('params should be immutable', () => {
      const client1 = isc('foo').media('music').limit(1)
      const client2 = client1.limit(2)
      expect(client1.getParams().limit).toBe(1)
      expect(client2.getParams().limit).toBe(2)
    })
  })

  test('#send', async () => {
    await isc('foo').media('music').send()
    expect(fetch).toBeCalledWith('https://itunes.apple.com/search?term=foo&media=music&limit=10&lang=en_us&country=us', { method: 'GET' })
  })
})
