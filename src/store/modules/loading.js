
const state = {
    loading: false,
    isProgress: false,
    loadingText: '正在保存您的配置,请耐心等待...',
    progressTime: 100
}
const getters = {

}
const mutations = {
    setLoading: (state, data) => {
        state.loading = data
    },
    setIsProgress: (state, data) => {
        state.isProgress = data
    },
    setLoadingText: (state, data) => {
        state.loadingText = data
    },
    setProgressTime: (state, data) => {
        state.progressTime = data
    },
}
const actions = {

}
export default { state, getters, mutations, actions }