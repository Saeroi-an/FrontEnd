import { StyleSheet } from 'react-native';

const BLUE = '#5B7CFF';
const RADIUS = 24;

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* 헤더 */
  header: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  /* 진행바 */
  progressTrack: {
    height: 6,
    marginHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  progressFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: BLUE,
  },

  /* 본문 */
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
  },

  thumbBox: {
    alignItems: 'center',
    marginTop:120,
    marginBottom:-50
  },
  thumb: {
    width: 210,
    height: 210,
  },
  title: {
    textAlign: 'center',
    fontSize: 21,
    fontWeight: 'bold',
    color: '#111',
    lineHeight: 32,
    marginBottom: 56,
  },

  /* 버튼 */
  btn: {
    height: 53,
    borderRadius: RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginBottom: 15,
  },

  btnPrimary: {
    backgroundColor: '#474A4F', // 스샷처럼 다크 그레이 톤
    // shadow for subtle elevation
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  btnGhost: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D6D9DE',
  },
  btnGhostText: {
    color: '#111',
    fontSize: 14,
    fontWeight: '700',
  },
});
