import { StyleSheet } from 'react-native';

const BLUE = '#5B7CFF';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal:6,
  },

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
    marginVertical: 12,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  progressFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: BLUE,
  },

  categoryText: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 50,
  },

  qText: {
    fontSize: 15,
    fontWeight: '300',
    color: '#111',
    marginBottom: 50,
    marginTop: 10,
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
  optBtn: {
    paddingHorizontal: 16,
    borderRadius: 20,
    marginVertical: 5,
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'center',     // 텍스트 세로 중앙
    position: 'relative',
  },
  optRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // ✅ 아이콘을 오른쪽 끝으로
  },
  optActive: {
    borderColor: '#007AFF',
    backgroundColor: '#EAF2FF',
  },
  optInactive: {
    borderColor: '#ddd',
  },
  optText: {
    fontSize: 16,
    color: '#333',
    marginLeft:5,
  },
  optTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  optCheck: {
    position: 'absolute',
  right: 16,      // ✅ 오른쪽 끝 여백

  },

});

