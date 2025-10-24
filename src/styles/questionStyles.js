import { StyleSheet } from 'react-native';

const BLUE = '#5B7CFF';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },

  /* 진행바 */
  progressTrack: {
    height: 6,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  progressFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: BLUE,
  },

  /* 본문 */
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  qBox: {
    marginBottom: 24,
  },
  qNum: {
    fontSize: 14,
    color: '#9AA1A9',
    marginBottom: 4,
  },
  qText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 12,
  },

  /* 옵션 버튼 */
  optBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  optActive: {
    borderColor: BLUE,
    backgroundColor: '#EEF3FF',
  },
  optInactive: {
    borderColor: '#E3E6EC',
    backgroundColor: '#fff',
  },
  optText: {
    fontWeight: '600',
    color: '#222',
  },
  optTextActive: {
    color: BLUE,
  },

  /* 하단 버튼 */
  bottomBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrev: {
    backgroundColor: '#D7DBE2',
  },
  btnNextOn: {
    backgroundColor: '#3C82FF',
  },
  btnNextOff: {
    backgroundColor: '#AEB4BC',
  },
  btnTextWhite: {
    color: '#fff',
    fontWeight: '700',
  },
  btnTextBlack: {
    color: '#111',
    fontWeight: '700',
  },
});
