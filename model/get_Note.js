import fetch from 'node-fetch'
import gsCfg from '../../genshin/model/gsCfg.js'
import lodash from 'lodash'
import md5 from 'md5'

export async function getNote(QQ) {
    let Data
    try {
        let getYaml = gsCfg.getBingCkSingle(QQ)
        let ck = lodash.find(getYaml, {'isMain': true}).ck
        let getUidOptions = {
            method: 'GET',
            headers: {
                Host: 'api-takumi.mihoyo.com',
                'x-rpc-client_type': '5',
                'x-rpc-challenge': 'null',
                'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                Accept: 'application/json, text/plain, */*',
                Origin: 'https://webstatic.mihoyo.com',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.49.1',
                'x-rpc-page': 'undefined',
                'x-rpc-app_version': '2.49.1',
                Referer: 'https://webstatic.mihoyo.com/',
                Connection: 'keep-alive',
                Cookie: `${ck}`
            }
        };
        let getUid = await fetch('https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hkrpg_cn', getUidOptions)
        let getUidCallBack = await getUid.json()
        const n = 'xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs'
        let t = Math.round(new Date().getTime() / 1000)
        let r = Math.floor(Math.random() * 900000 + 100000)
        let DS = md5(`salt=${n}&t=${t}&r=${r}&b=&q=role_id=${getUidCallBack.data.list[0]['game_uid']}&server=${getUidCallBack.data.list[0]['region']}`)
        let getNoteOptions = {
            method: 'GET',
            headers: {
                'x-rpc-app_version': '2.37.1',
                'x-rpc-client_type': 5,
                'User-Agent': `Mozilla/5.0 (Linux; Android 12; Yz-HDAONs) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.73 Mobile Safari/537.36 miHoYoBBS/2.37.1`,
                Referer: 'https://webstatic.mihoyo.com',
                DS: `${t},${r},${DS}`,
                Cookie: `${ck}`
            }
        };
        let getNote = await fetch(`https://api-takumi-record.mihoyo.com/game_record/app/hkrpg/api/note?server=${getUidCallBack.data.list[0]['region']}&role_id=${getUidCallBack.data.list[0]['game_uid']}`, getNoteOptions)
        getNote = await getNote.json()
        getNote.data.uid=getUidCallBack.data.list[0]['game_uid']
        getNote.data.region=getUidCallBack.data.list[0]['region']
        getNote.data.QQ=QQ
        Data = getNote.data
        // Data = {
        //     "uid": getUidCallBack.data.list[0]['game_uid'], //UID
        //     "region": getUidCallBack.data.list[0]['region'],    //区服
        //     "current_stamina": getNoteCallBack.data.current_stamina,    //当前开拓力
        //     "max_stamina": getNoteCallBack.data.max_stamina,    //最大开拓力
        //     "expeditions": getNoteCallBack.data.expeditions   //派遣队伍
        // }
        // let sendMsg = [`==============\nUID：${getUidCallBack.data.list[0]['game_uid']}\n==============\n当前开拓力:${getNoteCallBack.data.current_stamina}/${getNoteCallBack.data.max_stamina}\n==============\n`]
        // for (let i = 0; i < getNoteCallBack.data.expeditions.length; i++) {
        //     let time = getNoteCallBack.data.expeditions[i].remaining_time / 60 / 60
        //     let str = time.toString()
        //     let msg = `派遣${i + 1}「${getNoteCallBack.data.expeditions[i].name}」:${getNoteCallBack.data.expeditions[i].status} 剩余时间:${str.substring(0, str.indexOf(".") + 3)}小时\n==============\n`
        //     sendMsg.push(msg)
        // }
        // e.reply(sendMsg)
    } catch (error) {
        // logger.info(error)
        console.log(error)
        Data = {
            "code": 1,
            "message": "您未绑定ck或该账号无铁道注册信息\n请通过[ #扫码登录 ]完成绑定\n多ck请使用#uid+数字来切换ck"
        }
    }
    return Data
}