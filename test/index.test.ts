import 'isomorphic-unfetch'
import { assert, IsExact } from 'conditional-type-checks'
import isc, { Entity, Attribute } from '../src'

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

  describe('type checks', () => {
    test('when the media is movie', () => {
      const client = isc('foo').media('movie')
      type E = (value: Entity['movie']) => any
      type A = (value: Attribute['movie']) => any
      assert<IsExact<typeof client.entity, E>>(true);
      assert<IsExact<typeof client.attribute, A>>(true);
    })

    test('when the media is music', () => {
      const client = isc('foo').media('music')
      type E = (value: Entity['music']) => any
      type A = (value: Attribute['music']) => any
      assert<IsExact<typeof client.entity, E>>(true);
      assert<IsExact<typeof client.attribute, A>>(true);
    })

    test('when the media is music', () => {
      const client = isc('foo').media('music')
      type E = (value: Entity['music']) => any
      type A = (value: Attribute['music']) => any
      assert<IsExact<typeof client.entity, E>>(true);
      assert<IsExact<typeof client.attribute, A>>(true);
    })

    test('when the media is podcast', () => {
      const client = isc('foo').media('podcast')
      type E = (value: Entity['podcast']) => any
      type A = (value: Attribute['podcast']) => any
      assert<IsExact<typeof client.entity, E>>(true);
      assert<IsExact<typeof client.attribute, A>>(true);
    })

    test('when the media is musicVideo', () => {
      const client = isc('foo').media('musicVideo')
      type E = (value: Entity['musicVideo']) => any
      type A = (value: Attribute['musicVideo']) => any
      assert<IsExact<typeof client.entity, E>>(true);
      assert<IsExact<typeof client.attribute, A>>(true);
    })

    test('when the media is audiobook', () => {
      const client = isc('foo').media('audiobook')
      type E = (value: Entity['audiobook']) => any
      type A = (value: Attribute['audiobook']) => any
      assert<IsExact<typeof client.entity, E>>(true);
      assert<IsExact<typeof client.attribute, A>>(true);
    })

    test('when the media is shortFilm', () => {
      const client = isc('foo').media('shortFilm')
      type E = (value: Entity['shortFilm']) => any
      type A = (value: Attribute['shortFilm']) => any
      assert<IsExact<typeof client.entity, E>>(true);
      assert<IsExact<typeof client.attribute, A>>(true);
    })

    test('when the media is tvShow', () => {
      const client = isc('foo').media('tvShow')
      type E = (value: Entity['tvShow']) => any
      type A = (value: Attribute['tvShow']) => any
      assert<IsExact<typeof client.entity, E>>(true);
      assert<IsExact<typeof client.attribute, A>>(true);
    })

    test('when the media is software', () => {
      const client = isc('foo').media('software')
      type E = (value: Entity['software']) => any
      type A = (value: Attribute['software']) => any
      assert<IsExact<typeof client.entity, E>>(true);
      assert<IsExact<typeof client.attribute, A>>(true);
    })

    test('when the media is software', () => {
      const client = isc('foo').media('ebook')
      type E = (value: Entity['ebook']) => any
      assert<IsExact<typeof client.entity, E>>(true);
      // ebook attribute does not exist
    })

    test('when the media is all', () => {
      const client = isc('foo').media('all')
      type E = (value: Entity['all']) => any
      type A = (value: Attribute['all']) => any
      assert<IsExact<typeof client.entity, E>>(true);
      assert<IsExact<typeof client.attribute, A>>(true);
    })
  })
})
