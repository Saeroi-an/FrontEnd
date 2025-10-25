// styles/historyStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff', paddingHorizontal:5, },

  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E8EB',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  pageTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#111',
    marginTop: 26,
    marginBottom: 12,
  },

  yearHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5F6368',
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    maxWidth: '90%',
  },

  cardMetaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  cardMetaText: {
    fontSize: 13,
    color: '#9AA0A6',
    marginLeft: 6,
  },

  separator: {
    height: 12,
  },

  emptyBox: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5F6368',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#9AA0A6',
  },
});
