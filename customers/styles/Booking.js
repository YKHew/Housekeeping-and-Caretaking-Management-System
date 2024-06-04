import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //height: '100%',
        //justifyContent: 'center',
        alignItems: 'justify',
        backgroundColor: '#F5FCFF',
        paddingHorizontal: 10,

    },
    progressContainer: {
        flex: 1,
    },
    progressContent: {
        alignItems: 'justify',
    },
    sectionContainer: {
        flexDirection: 'column',
        margin: 10,
    },
    selectedService: {
        borderWidth: 1,
        borderColor: '#d2d2d2',
        borderRadius: 10,
        alignItems: 'center',
        padding: 5,
    },

    //----------------------------------------------------------
    datePicker: {
        //flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
        borderColor: "#d2d2d2",
        borderWidth: 1,
        borderRadius: 10,
    },


    availableShiftList: {
        //justifyContent: 'center',
        backgroundColor: 'yellow'
    },

    shiftContainer: {
        //backgroundColor: 'pink',

    },

    shifts: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        margin: 5,
        borderRadius: 20,
        paddingHorizontal: 40,
        paddingVertical: 10,
        //backgroundColor: 'pink',
    },
    shiftText: {
        textAlign: 'center',
        fontSize: 16,
    },

    //----------------------------------------------------------
    address: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#000080',
        marginVertical: 10,
        padding: 10,
    },
    addressBtn: {
        borderRadius: 60,
        padding: 10,
        backgroundColor: '#0a75ad',
    },

    addAddressBtn: {
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 60,
        borderColor: '#0a75ad',
        backgroundColor: 'white',
        paddingVertical: 10,
    },

    //----------------------------------------------------------
    otherServiceList: {
        flexDirection: 'column',
        alignItems: 'justify',
        borderWidth: 1,
        borderRadius: 20,
        margin: 10,
        padding: 10,
    },
    tasksList: {
        //width: 300,
        flexDirection: 'row',
    },

    //----------------------------------------------------------
    summaryContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    confirmationHeader: {
        alignItems: 'center',
    },
    confirmationHeaderText: {
        fontWeight: 'bold',
        fontSize: 24,
    },

    subText: {
        fontSize: 16,
    },

    servicesConfirm: {
        alignItems: 'center',
    },
    servicesTimeContainer: {
        flexDirection: 'row',
        //marginHorizontal: 50,
        //alignItems: 'center',
    },
    servicesTime: {
        //flex: 1,
        flexDirection: 'row',
        //marginHorizontal: 10,
        alignItems: 'center',

    },
    servicesHeader: {
        borderBottomWidth: 1,
        marginVertical: 10,
    },

    servicesTimeHeaderText: {
        fontWeight: 'bold',
        fontSize: 26,
        alignItems: 'center',
        marginHorizontal: 10,
        //borderBottomWidth: 1,
    },
    servicesTimeText: {
        fontWeight: 'bold',
        fontSize: 20,
        alignItems: 'center',
        marginHorizontal: 10,
    },

    clientConfirm: {
        //backgroundColor: 'pink',
        //alignItems: 'justify',
        margin: 10,
    },
    client: {
        marginVertical: 10,
    },
    clientText: {
        fontSize: 20,
        alignItems: 'center',
        paddingHorizontal: 20,
        textAlign: 'justify'
    },

    btnContent: {
        flex: 1,
        padding: 20,
    },
    submitBtn: {
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: '#0a75ad',
    },
    submitBtnText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        //flex: 1,
        //backgroundColor: 'pink'
    },


    //----------------------------------------------------------
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionContent: {
        width: '100%',
        fontSize: 18,
    },
    sectionBtn: {
        marginHorizontal: 10,
        fontSize: 16,
        //backgroundColor: action ? 'white' : 'black',
    },
    addressList: {
        flexDirection: 'row',
        marginVertical: 1,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: '#e6e6fa',
    },
    iconContainer: {

        justifyContent: 'center',
        padding: 10,

    },
    addressTextContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    addressTypeText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    addressText: {
        fontSize: 16,
    },
    otherServiceTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    otherServiceText: {
        fontSize: 16,
        flexWrap: 'wrap',
    },
    extraRequestInput: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 18,
        textAlignVertical: 'top',
    },
})

export { styles }