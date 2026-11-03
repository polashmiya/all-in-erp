import { enUSIntl, type IntlType } from '@ant-design/pro-components';
import type { Language } from '../i18n/language';

const bnMessages: Record<string, string> = {
  moneySymbol: '৳',
  'tableForm.search': 'খুঁজুন',
  'tableForm.reset': 'রিসেট',
  'tableForm.submit': 'জমা দিন',
  'tableForm.collapsed': 'আরও দেখুন',
  'tableForm.expand': 'সংক্ষেপ করুন',
  'tableForm.inputPlaceholder': 'লিখুন',
  'tableForm.selectPlaceholder': 'নির্বাচন করুন',
  'alert.clear': 'মুছুন',
  'alert.selected': 'নির্বাচিত',
  'alert.item': 'টি',
  'pagination.total.range': ' ',
  'pagination.total.total': 'মোট',
  'pagination.total.item': 'টি',
  'tableToolBar.reset': 'রিসেট',
  'tableToolBar.columnDisplay': 'কলাম প্রদর্শন',
  'tableToolBar.columnSetting': 'টেবিল সেটিংস',
  'tableToolBar.fullScreen': 'পূর্ণ স্ক্রিন',
  'tableToolBar.exitFullScreen': 'পূর্ণ স্ক্রিন বন্ধ',
  'tableToolBar.reload': 'রিফ্রেশ',
  'tableToolBar.density': 'ঘনত্ব',
  'tableToolBar.densityDefault': 'ডিফল্ট',
  'tableToolBar.densityLarger': 'বড়',
  'tableToolBar.densityMiddle': 'মাঝারি',
  'tableToolBar.densitySmall': 'কমপ্যাক্ট',
  'tableToolBar.leftPin': 'বামে পিন',
  'tableToolBar.rightPin': 'ডানে পিন',
  'tableToolBar.noPin': 'পিন নেই',
  'stepsForm.next': 'পরবর্তী',
  'stepsForm.prev': 'পূর্ববর্তী',
  'stepsForm.submit': 'সম্পন্ন',
  'loginForm.submitText': 'লগইন',
  'form.lightFilter.more': 'আরও',
  'form.lightFilter.clear': 'মুছুন',
  'form.lightFilter.confirm': 'নিশ্চিত',
  'form.lightFilter.itemUnit': 'টি',
};

const bnBDIntl: IntlType = {
  locale: 'bn-BD',
  getMessage: (id, defaultMessage) => bnMessages[id] ?? enUSIntl.getMessage(id, defaultMessage),
};

export const proIntl: Record<Language, IntlType> = { en: enUSIntl, bn: bnBDIntl };
