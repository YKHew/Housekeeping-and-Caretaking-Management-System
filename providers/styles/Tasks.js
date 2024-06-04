import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        padding: 5,
        //marginBottom: 300,
    },
    segmentedButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#b0e0e6', // Set the background color for the container
        borderRadius: 10,
        //borderWidth: 1,
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
        color: 'black',
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


    taskContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        //marginHorizontal: 10,
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: '#d9f3f0',
        //borderWidth: 1
    },
    taskLeftContainer: {
        flex: 1,
    },
    taskInfoContainer: {
        flexDirection: 'row',
    },
    taskDateTime: {
        flexDirection: 'column',
        flex: 1,
    },
    taskInfoText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    taskSubInfoText: {
        fontSize: 16,
        color: '#406c68',
    },
    taskIcon: {
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    //status text
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
    overdueStatus: {
        color: '#d20000', // Change this to the desired color for 'Cancel'
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

    },
    infoView: {
        //width: '100%',
        //flex: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        paddingVertical: 5,
        //alignItems: 'center',
    },
    clientInfo: {

    },
    taskInfo: {
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
    },
    modalText: {
        fontSize: 16,
        marginHorizontal: 10,
        //padding: 3,
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