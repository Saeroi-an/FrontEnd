import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: 80 },
    title: { fontSize: 22, fontWeight: '700', color: '#111' },
    subtitle: { fontSize: 14, color: '#777', marginTop: 6, marginBottom: 50 },
  
    list: { width: '100%' },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height:80,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 12,
      backgroundColor: '#f9f9f9',
    },
    itemActive: {
      borderColor: '#2F6FED',
      backgroundColor: '#EEF4FF',
    },
    flagBox: { width: 50 },
    flag: { width: 70, height: 40, },
    textBox: { flex: 1, marginLeft:30, },
    label: { fontSize: 16, fontWeight: '600', color: '#111' },
    activeText: { color: '#2F6FED' },
    sub: { fontSize: 13, color: '#666', marginTop:2, },
  
    btn: {
      backgroundColor: '#2F6FED',
      width: '90%',
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      position: 'absolute',
      bottom: 40,
    },
    btnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  });