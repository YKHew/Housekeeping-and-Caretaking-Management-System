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
    content: {
        flex: 1,
    },
    infoContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        backgroundColor: '#ccefec',
        borderRadius: 10,
        paddingTop: 10,
    },
    intro: {

    },
    introText: {
        textAlign: 'justify',
        fontSize: 16,

    },
    staffImg: {
        height: 200,
        width: 150,
        marginHorizontal: 10,
    },
    info: {
        justifyContent: 'flex-end',
    },
    infoText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    subInfoContainer: {
        flexDirection: 'row',
    },
    subInfo: {
        flexDirection: 'row',
        paddingVertical: 10,
        marginHorizontal: 10,
    },
    subInfoText: {
        fontSize: 18, 
        justifyContent: 'center',
        marginHorizontal: 5,
        
    },
    details: {
        margin: 10,
        flexDirection: 'row',
    },
    detailsLRHS: {
        flex: 1,
        marginHorizontal: 10,
    },
    detailListContainer: {
        //flexDirection: 'row',
        marginVertical: 10,
    },
    detailsList: {
        alignContent: 'center',
        marginVertical: 10,
    },
    detailsListText: {
        //fontSize: 16,
        //marginHorizontal: 10,
    },

    bottomBtn: {
        margin: 40,
        bottom: 0
    },
    selectBtn: {
        height: 50,
        backgroundColor: '#0a75ad',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectBtnText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
    },


    feedbackList: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#e6e6fa',
        paddingVertical: 10,
    },
    feedbackStaffImg: {
        height: 50,
        width: 50,
        //padding: 10,
        marginHorizontal: 10,
        borderRadius: 50,
    },
    feedbackInfo: {
        flex: 1,
    },
    feedbackRate:{
        marginHorizontal: 10,
    },
    starContainer: {
        flexDirection: 'row',
    }
})

export { styles }