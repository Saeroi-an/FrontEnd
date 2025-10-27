import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },

    titleTop: { fontSize: 14, color: '#6B7280', marginBottom: 6, marginTop:15 },
    titleMain: { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 22 },

    label: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 10, marginTop:30, },

    segmentRow: { flexDirection: 'row', gap: 10 },
    segment: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D7DCE2',
        backgroundColor: '#fff',
    },
    segmentActive: {
        borderColor: '#2F6FED',
        backgroundColor: '#EEF4FF',
    },
    segmentText: { fontSize: 14, color: '#111', fontWeight: '600' },
    segmentTextActive: { color: '#2F6FED' },

    select: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D7DCE2',
        paddingHorizontal: 14,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
    },
    selectText: { fontSize: 15, color: '#111', fontWeight: '600' },

    inlineInputs: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
    },
    underlineInput: {
        width: 90,
        borderBottomWidth: 1,
        borderBottomColor: '#CBD2DA',
        paddingVertical: 6,
        fontSize: 16,
        color: '#111',
    },
    unit: { fontSize: 14, color: '#111', marginBottom: 8 },

    button: {
        position: 'absolute',
        bottom: 32,
        left: 20,
        right: 20,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#2F6FED',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    buttonText: { color: '#fff', fontSize: 17, fontWeight: '800' },

    /* modal */
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        maxHeight: '60%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    modalTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
    yearRow: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EEF1F4',
    },
    yearText: { fontSize: 16, color: '#111' },
});
