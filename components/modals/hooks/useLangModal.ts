import { useEffect, useState } from "react"
import { LangMode } from "@/components/modals/types/lang.store"
import { useTranslation } from "react-i18next"
import * as SecureStore from 'expo-secure-store';

export const useLangModal = () => {
  const { i18n } = useTranslation()
  const [selectedLang, setSelectedLang] = useState<LangMode>('es')
  const [langSaved, setLangSaved] = useState<LangMode>('es')

  const handlerLang = async() => {
    if (langSaved !== selectedLang) {
      await i18n.changeLanguage(selectedLang)
      await SecureStore.setItemAsync('userLang', selectedLang)
      setLangSaved(selectedLang)
    }
  }

  const getLanguage = async() => {
    const lang = await SecureStore.getItemAsync('userLang')
    if(lang) {
      setSelectedLang(lang as LangMode)
      setLangSaved(lang as LangMode)
    }
  }

  useEffect(() => {
    getLanguage()
  }, [])
  

  return {
    selectedLang,
    setSelectedLang,
    handlerLang
  }
}