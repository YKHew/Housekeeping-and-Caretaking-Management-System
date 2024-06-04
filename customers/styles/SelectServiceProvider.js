import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //height: '100%',
        //justifyContent: 'center',
        alignItems: 'justify',
        backgroundColor: '#F5FCFF',
        paddingHorizontal: 5,
    },
    filterContainer: {
        flexDirection: 'row',
        //justifyContent: "flex-end",
        marginVertical: 5,
        alignItems: 'center',
    },
    filterIcon: {
        marginHorizontal: 10,
    },
    currentDateDay: {
        marginHorizontal: 10,
        flex: 1,
        flexDirection: 'row',
    },
    currentDateDayText: {
        marginHorizontal: 5,
        fontWeight: 'bold',
        fontSize: 16,
    },

    staffListContainer: {
        flexDirection: 'row',
        padding: 10,
        flexWrap: 'wrap',
        borderWidth: 2,
        borderRadius: 30,
        margin: 10,
    },
    staffImg: {
        height: 120,
        width: 80,
        marginHorizontal: 10,
    },
    staffInfoContainer: {
        flexDirection: 'row',
    },
    staffInfo: {
        flexDirection: 'column',
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    staffInfoText: {
        //alignItems: 'center',
        textAlign: 'justify',
        fontSize: 16,
    },
    timeSlotList: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#e6e6fa',
        paddingHorizontal: 10,
        marginHorizontal: 10,
        marginVertical: 5,
    },

    //Popup Filter Screen
    centeredView: {
        flex: 1,
        backgroundColor: 'white',
        //justifyContent: 'center',
        alignItems: 'justify',
        paddingHorizontal: 10,
        //marginTop: 22,
    },
    modalView: {
        //margin: 20,
        backgroundColor: 'white',
        //borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 30,
    },
    modalContent: {
        marginBottom: 15,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderColor: '#0a75ad'
    },
    modalContentTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    modelBtnContainer: {
        flexDirection: 'row',
        margin: 10,
    },

    modalBtnSelection: {
        borderWidth: 1,
        borderColor: '#e6e6fa',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginHorizontal: 5,
    },
    modalBtnSelectionActive: {
        borderWidth: 1,
        backgroundColor: '#0a75ad',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginHorizontal: 5,
    },
    modalBtnTextSelection: {
        color: 'black'
    },
    modalBtnTextSelectionActive: {
        color: 'white'
    },



    bottomBtn: {
        borderRadius: 20,
        padding: 10,
        paddingHorizontal: 20,
        elevation: 2,
        marginHorizontal: 10,
        backgroundColor: '#0a75ad',
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    modalBottomBtn: {
        flexDirection: 'row',
        alignItems: 'right',
    },

    modalButtonOnPress: {
        backgroundColor: '#e6e6fa',
    },
})

export { styles }