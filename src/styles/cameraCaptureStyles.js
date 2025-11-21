import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { alignItems: 'center', },
    title: { fontSize: 16, fontWeight: '500', marginBottom: 16, alignSelf: 'flex-start' },
    imageWrap: { width: '100%', height: 500, alignItems: 'center', marginBottom: 20 },
    image: { width: '100%', height: '100%', borderRadius: 0, resizeMode: 'cover' },
    placeholder: { width: 300, height: 300, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
    card: {
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 0,
        padding: 16,
        // shadowColor: '#000',
        // shadowOpacity: 0.08,
        // shadowRadius: 6,
        elevation: 4,
    },
    cardTitle: { fontWeight: '600', marginBottom: 30, fontSize:19, fontWeight:'bold', marginLeft:12 },
    cardtext:{
        marginHorizontal:18,
    },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    label: { fontWeight: '600', color: '#4b5563', marginBottom:5,marginLeft:1,},
    value: {marginBottom:5,

    },
    button: { backgroundColor: '#111827', paddingVertical: 16, paddingHorizontal: 145, borderRadius: 10, marginBottom:100, },
    btnText: { color: 'white', fontSize: 16, fontWeight: '600' },

  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E8EB',
    marginTop:50,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
});