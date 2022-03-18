import _truncate from '~/utils/truncate'

export const truncate = {
  methods: {
    truncate (...args) {
      return _truncate(...args)
    }
  }
}
