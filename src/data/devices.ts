import type { Category, Device } from '../types'
import { appleDevices } from './devices.apple'
import { androidDevices } from './devices.android'

export const devices: Device[] = [...appleDevices, ...androidDevices]

export const deviceById = new Map(devices.map((d) => [d.id, d]))

export const CATEGORY_LABEL: Record<Category, string> = {
  ipad: 'iPad',
  iphone: 'iPhone',
  'galaxy-tab': 'Galaxy Tab',
  'galaxy-phone': 'Galaxy phone',
  'oneplus-phone': 'OnePlus phone',
  'oneplus-pad': 'OnePlus Pad',
}

export const CATEGORY_ORDER: Category[] = ['ipad', 'iphone', 'galaxy-tab', 'galaxy-phone', 'oneplus-phone', 'oneplus-pad']
