
export const ECOSYSTEM_DOMAIN = Object.freeze({
  SOCIO_ECOLOGICAL: 'SOCIO_ECOLOGICAL',
  SOCIO_ECONOMICAL: 'SOCIO_ECONOMICAL',
  SOCIO_POLITICAL: 'SOCIO_POLITICAL',
  SOCIO_PSYCHOLOGICAL: 'SOCIO_PSYCHOLOGICAL'
})

export const parseEcosystemDomain = (domain) => {
  switch (domain) {
    case ECOSYSTEM_DOMAIN.SOCIO_ECOLOGICAL:
      return 'Socio-Ecological'
    case ECOSYSTEM_DOMAIN.SOCIO_ECONOMICAL:
      return 'Socio-Economical'
    case ECOSYSTEM_DOMAIN.SOCIO_POLITICAL:
      return 'Socio-Political'
    case ECOSYSTEM_DOMAIN.SOCIO_PSYCHOLOGICAL:
      return 'Socio-Psychological'
  }
}

export const EXPLORE_BY = Object.freeze({
  DAOS: 'DAOS',
  ECOSYSTEMS: 'ECOSYSTEMS'
})
