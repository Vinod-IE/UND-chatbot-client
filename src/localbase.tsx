/* eslint-disable camelcase */
import Localbase from 'localbase' // https://github.com/dannyconnell/localbase

const db = new Localbase('db')

const Template_LIST_TITLES = { // Add all lists to be stored in IndexedDB localbase here
  KBArticles: 'KnowledgeBaseArticles',
  MasterList: 'MasterList'
}

export { db, Template_LIST_TITLES }
