// styles/historyDetailStyles.js
import { StyleSheet, Platform } from 'react-native';

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 2 },
  default: {},
});

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { padding: 16 },

  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop:53,
    backgroundColor: '#FFFFFF',
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

  // 헤더
  title: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  subTitle: { marginTop: 4, color: '#6B7280' },

  // 섹션 카드
  section: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    ...shadow,
  },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sectionHeaderIcon: { marginRight: 6 },
  sectionHeaderText: { fontSize: 16, fontWeight: '700', color: '#111827' },

  // Q/A 아이템
  qaItem: {},
  qText: { fontWeight: '700', color: '#111827', marginBottom: 6 },
  aRow: { flexDirection: 'row', alignItems: 'flex-start' },
  aLabel: { color: '#6B7280' },      // "A. 환자의 대답:"
  aValue: { color: '#374151' },      // 실제 답변 값

  // 구분선 & 빈 상태
  divider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 10 },
  emptyWrap: { marginTop: 24, alignItems: 'center' },
  emptyText: { color: '#9CA3AF' },
  
  translationnotice: {color: '#3276EB', fontWeight:'bold',marginVertical: 8, marginLeft: 10,fontSize:18,},
  translatiosubnotice: {color: '#3276EB', marginLeft: 10,fontSize:13, marginBottom:5,}
});
