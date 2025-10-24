import { StyleSheet } from 'react-native';

const BLUE = '#5B7CFF';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

  /* 헤더 */
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#111' },

  /* 진행바 */
  progressTrack: {
    height: 6,
    marginHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  progressFill: {
    height: 6,
    width: '16%',               // 단계에 맞게 조정
    borderRadius: 999,
    backgroundColor: BLUE,
  },

  /* 타이틀 */
  titleBox: { alignItems: 'center', marginTop: 16, marginBottom: 8, paddingHorizontal: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 5, marginTop:20, },
  subtitle: { fontSize: 13, color: '#6B7480', marginBottom:40, },

  /* 그리드 */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 40,
    gap: 12,
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    height: 128,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E6EC',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  tileOn: {
    borderColor: BLUE,
    backgroundColor: '#EEF3FF',
  },
  tileImage: { width: 64, height: 64, borderRadius: 12, marginBottom: 10, resizeMode: 'contain' },
  placeholder: { backgroundColor: '#E6E8EC' },
  tileLabel: { fontSize: 14, color: '#333', fontWeight: '700' },
  tileLabelOn: { color: BLUE },

  /* 다음 버튼 */
  nextBtn: {
    marginTop: 'auto',
    marginHorizontal: 16,
    marginBottom: 24,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnOn: { backgroundColor: '#3C82FF' },
  nextBtnOff: { backgroundColor: '#AEB4BC' },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
