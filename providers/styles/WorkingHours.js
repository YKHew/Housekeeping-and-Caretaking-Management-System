import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingHorizontal: 5,
        //marginBottom: 300,
    },

    listContainer: {
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#e6e6fa',
        marginBottom: 5,
    },

    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#a9e9f6',
        paddingHorizontal: 5,
    },
    topText: {
        flex: 1,
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        //color: 'white',
        marginHorizontal: 10,
    },
    topIcon: {
        flexDirection: 'row',
        marginHorizontal: 10,
    },

    timeContainer: {
        flexDirection: 'row',

    },
    shiftText: {
        flex: 1,
        marginVertical: 10,
        paddingHorizontal: 20,
        fontSize: 16,
        //backgroundColor: 'pink',
    },
    timeTextContainer: {
        flex: 1,

    },
    timeText: {
        marginVertical: 10,
        paddingHorizontal: 20,
        fontSize: 16,
        textAlign:'center',
        //backgroundColor: 'pink',
    },

    // Modal View Design
    modalViewContainer: {
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
        marginTop: 22,
        marginHorizontal: 10,
    },

    modalView: {
        //margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        //padding: 10,
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
    formView: {
        //width: '100%',
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        //alignItems: 'center',
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
})

export { styles }