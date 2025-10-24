import { StyleSheet } from 'react-native';

const RADIUS = 12;

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    marginBottom:-40,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#20242A',
    marginVertical:16,
    marginLeft:5,
    marginBottom:20,
  },

  card: {
    marginHorizontal:4,
    backgroundColor: '#fff',
    borderRadius: RADIUS,
    height:110,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,

    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  thumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#E6E8EC',
    marginLeft:7,
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaText: {
    fontSize: 13,
    color: '#8A8F98',
  },
});
