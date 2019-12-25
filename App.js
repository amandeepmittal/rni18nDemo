import React from 'react'
import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import { SafeAreaView, StyleSheet, Text } from 'react-native'

const translationGetters = {
  en: () => require('./src/translations/en.json'),
  nl: () => require('./src/translations/nl.json')
}

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
)

const setI18nConfig = () => {
  const fallback = { languageTag: 'en' }
  const { languageTag } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback

  translate.cache.clear()

  i18n.translations = { [languageTag]: translationGetters[languageTag]() }
  i18n.locale = languageTag
}

class App extends React.Component {
  constructor(props) {
    super(props)
    setI18nConfig()
  }

  componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange)
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange)
  }

  handleLocalizationChange = () => {
    setI18nConfig()
      .then(() => this.forceUpdate())
      .catch(error => {
        console.error(error)
      })
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.value}>{translate('hello')}</Text>
        <Text style={styles.value}>{translate('Good morning')}</Text>
        <Text style={styles.value}>Currency: {translate('Currency')}</Text>
        <Text style={styles.value}>Country: {RNLocalize.getCountry()}</Text>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  value: {
    fontSize: 24
  }
})

export default App
