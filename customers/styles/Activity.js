import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        padding: 5,
        //marginBottom: 300,
    },
    dateShow: {
        padding: 10,

    },
    todayDateBtn: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#0a75ad',
        backgroundColor: '#0a75ad',
        paddingHorizontal: 10,
    },
    todayDateBtnText: {
        fontSize: 20,
        color: 'white',

    },
    dateShowText: {
        fontSize: 20,
        flex: 1,
    },

    reserveContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        //marginHorizontal: 10,
        paddingVertical: 5,
        //paddingHorizontal: 20,
        backgroundColor: '#d9f3f0',
        //borderWidth: 1
    },
    providerImg: {
        width: 80,
        height: 100,
    },
    reserveInfo: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 5,
    },
    reserveStatus: {
        flexDirection: 'row',
        flex: 1,
    },

    reserveDateTime: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    reserveService: {
        flex: 1,
        flexDirection: 'row',
    },
    reserveServiceText: {
        flex: 1,

    },

    dateText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    timeText: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    pendingStatus: {
        color: '#0000ff', // Change this to the desired color for 'Pending'
    },
    rejectedStatus: {
        color: '#ff0000', // Change this to the desired color for 'Rejected'
    },
    finishedStatus: {
        color: '#3dc400', // Change this to the desired color for 'Finished'
    },
    cancelledStatus: {
        color: '#ffa500', // Change this to the desired color for 'Cancel'
    },

    infoText: {
        fontSize: 18,
    },

    staffImg: {
        width: 50,
        height: 50,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'red',
        marginLeft: 10,
        //flex: 1,
    },

    iconBtnAction: {
        flexDirection: 'column',
    },
    iconBtnContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        padding: 5,

    },
    iconBtn: {
        marginHorizontal: 5,
        color: "white",
    },
    iconBtnTextContainer: {
        justifyContent: 'center',
        marginHorizontal: 5,

    },
    iconBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "white",
    },


    // bottomBtn: {
    //     margin: 10,
    //     paddingVertical: 10,
    //     alignItems: 'center',
    //     borderWidth: 1,
    //     borderRadius: 10,
    //     backgroundColor: '#0a75ad',
    // },
    bottomBtnText: {
        fontSize: 18,
        color: 'white',
    },

    segmentedButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0a75ad', // Set the background color for the container
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#0a75ad',
        padding: 5,
    },
    segmentedButton: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    segmentedButtonText: {
        fontSize: 16,
        color: 'white',
    },
    selectedSegmentedButton: {
        backgroundColor: 'white',
        borderRadius: 10,
    },
    selectedSegmentedButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0a75ad',
    },


    scrollViewContent: {
        flexGrow: 1,
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    scrollableContent: {
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
    },



    modalViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //marginVertical: 150,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
    },

    modalView: {
        //margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 10,
        //alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 400,
    },
    infoView: {
        //width: '100%',
        //flex: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        paddingVertical: 5,
        //alignItems: 'center',
    },
    providerInfo: {

    },
    reservationInfo: {
        flexDirection: 'row',
        justifyContent: 'justify',
        marginVertical: 10,
    },
    modalTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    modalTextTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },
    modalText: {
        fontSize: 16,
        marginHorizontal: 10,
        //padding: 3,
        textAlign: 'justify',
    },
    feedbackRate: {
        flexDirection: 'row',
        //marginHorizontal: 10,
        justifyContent: 'space-between',
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBtnContainer: {
        flexDirection: 'row',
    },
    modalBtn: {
        flex: 1,
    },
    bottomBtn: {
        margin: 10,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#0a75ad',
    },
    bottomBtnText: {
        fontSize: 18,
        color: 'white',
    },
});

export { styles }