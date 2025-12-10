import { StyleSheet } from 'react-native';

const RADIUS = 16;

export default StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F5F6F8',
        marginBottom:-40,
        marginHorizontal:5,
      },
      container: {
        paddingHorizontal: 16,
        paddingTop: 15,
      },
      header: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      brandRow: { flexDirection: 'row', alignItems: 'center' },
      brandText: { marginLeft: 6, fontSize: 16, fontWeight: '700', color: '#111' },
    
      greetBox: { marginTop: 12, marginBottom: 8, },
      greetTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
      greetSub: { marginTop: 4, fontSize: 13, color: '#6B7480' },
    
      searchBox: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 999,
        paddingHorizontal: 12,
        height: 40,
        borderWidth: 1,
        borderColor: '#E8EBF0',
      },
      searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#111',
      },
    
      blueCard: {
        marginTop: 16,
        backgroundColor: '#364D7E',
        borderRadius: RADIUS,
        height:140,
        padding:20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        justifyContent: 'flex-start',
      },
      blueBadge: { color: '#E8EDFF', fontSize: 13, marginTop: 0 },
      blueTitle: { color: '#fff', fontSize: 19, fontWeight: '800', marginTop:2, },
      blueIconRow: { position: 'absolute', right: 10, bottom: -5, flexDirection: 'row' },
    
      sectionTitle: { marginTop: 18, marginBottom: 10, fontSize: 16, fontWeight: '700', color: '#222' },
      cardList: { gap: 10 },
    
      arrowCard: {
        backgroundColor: '#fff',
        borderRadius: RADIUS,
        height:80,
        padding:20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      },
      arrowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
      leadingIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F3F6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      },
      cardTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginTop:2, },
      cardSubtitle: { fontSize: 12, color: '#6B7480' },
    
      bmiCard: {
        marginTop: 14,
        backgroundColor: '#fff',
        borderRadius: RADIUS,
        padding: 14,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      },
      rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
      bmiRowText: { color: '#222', fontSize: 14 },
      bold: { fontWeight: '700' },
      separator: { color: '#B8C0CC' },
      bmiChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: '#E9F6EE',
      },
      bmiChipText: { color: '#26A969', fontSize: 12, fontWeight: '700' },
      bmiPointer: {
        position: "absolute",
        top: -3,          // bar 위로 살짝 올리기 (원하면 조정)
        width: 15,
        height: 15,
        borderRadius: 999,
        backgroundColor: "#333",
        transform: [{ translateX: -6 }], // pointer의 중심을 맞추기 위함
      },
      bmiBubbleContainer: {
        position: "absolute",
        top: -30,                    // 바 위로 띄우기
        transform: [{ translateX: -30 }], // 말풍선 중심 맞춤 (좌우 정렬)
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#F1F3F7",
        borderRadius: 12,
      },
      
      bmiBubbleText: {
        fontSize: 12,
        color: "#333",
        fontWeight: "600",
      },
      
      bmiCenter: {  marginVertical: 12 },
      bmiBubble: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: '#F1F3F7',
        color: '#333',
        fontSize: 12,
        overflow: 'hidden',
      },
      scaleBar: { height: 8, borderRadius: 8, overflow: 'hidden', flexDirection: 'row' },
      scaleSeg: { height: '100%' },
      scaleLabels: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      scaleLabel: { fontSize: 10, color: '#6B7480' },
    
      historyCard: {
        backgroundColor: '#fff',
        borderRadius: RADIUS,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    
        marginTop: 10,
      },
      historyMeta: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
      metaText: { color: '#9AA1A9', fontSize: 12 },
    });
