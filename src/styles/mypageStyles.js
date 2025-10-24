import { StyleSheet } from 'react-native';

const RADIUS = 16;

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    padding:10,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#20242A',
    marginBottom: 35,
    marginTop:10,
  },

  /* 프로필 */
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 40,
    marginLeft:10,
    backgroundColor: '#D9DCE0',
  },
  name: { fontSize: 16, fontWeight: '700', color: '#111' },
  subText: { marginTop: 4, fontSize: 12, color: '#6B7480', lineHeight: 16 },

  /* 카드 */
  card: {
    backgroundColor: '#fff',
    borderRadius: RADIUS,
    paddingVertical: 6,
    marginTop: 6,
    marginBottom: 24,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: { fontSize: 15, color: '#222', fontWeight: '600' },
  rowRightDim: { fontSize: 13, color: '#9AA1A9' },

  /* 로그아웃 */
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  logoutText: { fontSize: 15, color: '#111' },
});
