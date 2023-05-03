import fetch from 'node-fetch'
import lodash from 'lodash'
import gsCfg from '../../genshin/model/gsCfg.js'

export async function StarXingQiong(QQ) {
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
        const headers = {
            "Host": "api-takumi.mihoyo.com",
            "Origin": "https://webstatic.mihoyo.com",
            "Cookie": `${ck}`,
            "Connection": "keep-alive",
            "Accept": "*/*",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.49.1",
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Referer": "https://webstatic.mihoyo.com/",
            "Accept-Encoding": "gzip, deflate, br"
        }
        let callback = await fetch(`https://api-takumi.mihoyo.com/event/srledger/month_info?uid=${getUidCallBack.data.list[0]['game_uid']}&region=${getUidCallBack.data.list[0]['region']}&month=`, {
            headers: headers,
            method: 'GET'
        })
        let res = await callback.json()
        Data=res
        // Data = {
        //     "uid": getUidCallBack.data.list[0]['game_uid'], //UID
        //     "region": getUidCallBack.data.list[0]['region'],    //区服
        //     "day_data": {
        //         "current_hcoin": res.data.day_data.current_hcoin,   //本日获取星琼
        //         "current_rails_pass": res.data.day_data.current_rails_pass,  //本日获取星轨通票&星轨专票
        //         "last_hcoin": res.data.day_data.last_hcoin,  //昨日获取星琼
        //         "last_rails_pass": res.data.day_data.last_rails_pass    //昨日获取星轨通票&星轨专票
        //     },
        //     "month_data": {
        //         "current_hcoin": res.data.month_data.current_hcoin,  //本月获取星琼
        //         "current_rails_pass": res.data.month_data.current_rails_pass,   //本月获取星轨通票&星轨专票
        //         "last_hcoin": res.data.month_data.last_hcoin,   //上月获取星琼
        //         "last_rails_pass": res.data.month_data.last_rails_pass  //上月获取星轨通票&星轨专票
        //     }
        // }
        // e.reply(`==============\nUID：${getUidCallBack.data.list[0]['game_uid']}\n==============\n本日获取星琼：${res.data.day_data.current_hcoin}\n本日获取星轨通票&星轨专票：${res.data.day_data.current_rails_pass}\n==============\n昨日获取星琼：${res.data.day_data.last_hcoin}\n昨日获取星轨通票&星轨专票：${res.data.day_data.last_rails_pass}\n==============\n本月获取星琼：${res.data.month_data.current_hcoin}\n本月获取星轨通票&星轨专票：${res.data.month_data.current_rails_pass}\n==============\n上月获取星琼：${res.data.month_data.last_hcoin}\n上月获取星轨通票&星轨专票：${res.data.month_data.last_rails_pass}\n==============\n星琼收入组成：\n${res.data.month_data.group_by[0]['action_name']}：${res.data.month_data.group_by[0]['percent']}%\n${res.data.month_data.group_by[1]['action_name']}：${res.data.month_data.group_by[1]['percent']}%\n${res.data.month_data.group_by[2]['action_name']}：${res.data.month_data.group_by[2]['percent']}%\n${res.data.month_data.group_by[3]['action_name']}：${res.data.month_data.group_by[3]['percent']}%\n${res.data.month_data.group_by[4]['action_name']}：${res.data.month_data.group_by[4]['percent']}%\n${res.data.month_data.group_by[5]['action_name']}：${res.data.month_data.group_by[5]['percent']}%\n${res.data.month_data.group_by[6]['action_name']}：${res.data.month_data.group_by[6]['percent']}%\n==============`)
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