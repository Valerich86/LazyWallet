import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Header = ({title}) => {
  return (
    <View style={{
      width: '100%',
      height: 60,
      padding: 15
    }}>
      <Text style={{
        fontWeight: '500',
        fontSize: 20
      }}>
        {title}
      </Text>
    </View>
  )
}

export default Header
