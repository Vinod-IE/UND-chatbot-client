
import { faker } from '@faker-js/faker'
import { createRandomItemMetadata } from './metadata'
import { createRandomUser } from './user'
export const createRandomQuickLinks = (count: number): Array<any> => {
  const randomObjects: Array<any> = []

  for (let i = 0; i < count; i++) {
    randomObjects.push(createRandomQuickLink(i))
  }
  return randomObjects
}
const createRandomQuickLink = (id?: number): any => {
  const generateFakeArticleTitle = () => {
    const titlePrefixes = ['The Role of', 'Strategies for', 'Advancements in', 'Challenges in', 'Leadership in']
    const titleNouns = ['Cybersecurity', 'Counterterrorism', 'Logistics', 'Combat Training', 'Military Intelligence']
    const titleAdjectives = ['Modern', 'Tactical', 'Strategic', 'Operational', 'Specialized']

    const randomPrefix = titlePrefixes[faker.number.int(titlePrefixes.length - 1)]
    const randomNoun = titleNouns[faker.number.int(titlePrefixes.length - 1)]
    const randomAdjective = titleAdjectives[faker.number.int(titleAdjectives.length - 1)]

    return `${randomPrefix} ${randomAdjective} ${randomNoun}`
  }
  const itemMetadata = createRandomItemMetadata()
  return {
    // ID: id || faker.number.int({ min: 15, max: 100 }),
    Title: generateFakeArticleTitle(),
    Info: faker.lorem.paragraph(),
    URL: faker.internet.url(),
    IsArchived: faker.datatype.boolean(),
    ...itemMetadata
  }
}

export const createRandomPOCs = (count: number) : any => {
  const randomObjects: any = []

  for (let i = 0; i < count; i++) {
    randomObjects.push(createRandomPOC(i))
  }
  return randomObjects
}

export const createRandomPOC = (id?: number): any => {
  const user = createRandomUser()
  const itemMetadata = createRandomItemMetadata()
  return {
    // ID: id || faker.number.int({ min: 1, max: 100 }),
    ContactName: user.Title ? user.Title : faker.person.fullName(),
    ContactEmail: user.Email,
    ContactTitle: user.Title ? user.Title : faker.person.jobTitle(),
    ContactPhone: faker.phone.number('+1 ###-###-####'),
    IsArchived: faker.datatype.boolean(0.1),
    ...itemMetadata
  }
}
export const createRandomCalendarEvents = (count: number): any => {
  const randomObjects: any = []

  for (let i = 0; i < count; i++) {
    randomObjects.push(createRandomCalendarEvent(i))
  }
  return randomObjects
}
export const createRandomCalendarEvent = (id?: number): any => {
  const itemMetadata = createRandomItemMetadata()
  const date = faker.date.future()
  // possible event types
  const eventTypes = ['Events', 'Trainings', 'WGMeetings']
  const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
  return {
    // ID: id || faker.number.int({ min: 1, max: 100 }),
    EventDate: date.toLocaleDateString(),
    EventType: randomEventType,
    EventTitle: faker.lorem.words(3),
    EventLocation: faker.location.streetAddress(),
    EventTime: date.toLocaleTimeString(),
    IsArchived: faker.datatype.boolean(),
    ...itemMetadata
  }
}
