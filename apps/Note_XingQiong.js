import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import {StarXingQiong} from "../model/get_XingQiong.js";
import {getNote} from "../model/get_Note.js";
import {SavaImg} from "../model/SaveImg.js";
import {FormatTime} from "../model/FormatTime.js";

let _path = process.cwd().replace(/\\/g, '/')

export class Note_XingQiong extends plugin {
    constructor() {
        super({
            name: '星穹铁道札记查询',
            dsc: '原神体米游社札记星穹铁道查询',
            event: 'message',
            priority: 300,
            rule: [
                {
                    reg: '^\\**(星穹|星琼|原石|石头)$',
                    fnc: 'ledger'
                }, {
                    reg: '^\\**(体力|开拓力)$',
                    fnc: 'Note'
                },
            ]
        })
    }

    async ledger(e) {
        let ResData = await StarXingQiong(e.user_id)
        if (!ResData) return
        if (ResData.code) {
            await e.reply(ResData.message)
            return
        }
        let ScreenData = await this.FormatLedgerData(ResData.data)
        let img = await puppeteer.screenshot('StarRailNoteLedger', ScreenData)
        if (img) await e.reply(img)
    }

    async Note(e) {
        let ResData = await getNote(e.user_id)
        if (!ResData) return
        if (ResData.code) {
            await e.reply(ResData.message)
            return
        }
        let ScreenData = await this.FormatNoteData(ResData)
        let img = await puppeteer.screenshot('StarRailNote', ScreenData)
        if (img) await e.reply(img)
    }

    async getNowMonth(dateString) {
        const year = dateString.slice(0, 4);
        const month = dateString.slice(4, 6);
        const date = new Date(`${year}-${month}-01`);
        return date.getMonth() + 1;
    }

    async FormatLedgerData(ledgerInfo) {
        logger.info(ledgerInfo)
        let day = await this.getNowMonth(ledgerInfo.month) + '月'
        ledgerInfo.month_data.last_mora = 0
        ledgerInfo.month_data.current_mora = 0
        ledgerInfo.day_data.current_mora = 0
        ledgerInfo.day_data.current_primogems = 0
        ledgerInfo.month_data.gacha = ledgerInfo.month_data.current_rails_pass
        ledgerInfo.month_data.last_gacha = ledgerInfo.month_data.last_rails_pass
        if (ledgerInfo.month_data.current_hcoin > 10000) {
            ledgerInfo.month_data.current_hcoin = (ledgerInfo.month_data.current_hcoin / 10000).toFixed(2) + ' w'
        }
        if (ledgerInfo.month_data.last_hcoin > 10000) {
            ledgerInfo.month_data.last_hcoin = (ledgerInfo.month_data.last_hcoin / 10000).toFixed(2) + ' w'
        }

        if (ledgerInfo.day_data.current_hcoin > 10000) {
            ledgerInfo.day_data.current_hcoin = (ledgerInfo.day_data.current_hcoin / 10000).toFixed(2) + ' w'
        }
        if (ledgerInfo.day_data.last_hcoin > 10000) {
            ledgerInfo.day_data.last_hcoin = (ledgerInfo.day_data.last_hcoin / 10000).toFixed(2) + ' w'
        }

        let color = ['#73a9c6', '#d56565', '#70b2b4', '#bd9a5a', '#739970', '#7a6da7', '#597ea0']
        ledgerInfo.color = []
        for (let i = 0; i < ledgerInfo.month_data.group_by.length; i++) {
            ledgerInfo.month_data.group_by[i].color = color[i]
            ledgerInfo.color.push(color[i])
        }
        ledgerInfo.group_by = JSON.stringify(ledgerInfo.month_data.group_by)
        ledgerInfo.color = JSON.stringify(ledgerInfo.color)
        const replaceMap = {
            '模拟宇宙奖励': '模拟宇宙',
            '忘却之庭奖励': '忘却之庭',
        }

        ledgerInfo.month_data.group_by = ledgerInfo.month_data.group_by.map(item => {
            const {action_name} = item
            const newName = replaceMap[action_name] || action_name
            return {...item, action_name: newName}
        })
        return {
            saveId: ledgerInfo.uid,
            uid: ledgerInfo.uid,
            day,
            tplFile: `${_path}/plugins/Honkai-StarRail/resources/html/XingQiong/ledger.html`,
            pluResPath: `${_path}/plugins/Honkai-StarRail/resources/`,
            ...ledgerInfo
        };
    }

    async FormatNoteData(NoteData) {
        let saveImgPath = `${_path}/plugins/Honkai-StarRail/resources/img/RoleAvatar/`
        await SavaImg(saveImgPath, NoteData)
        NoteData.stamina_recover_time =await FormatTime(NoteData.stamina_recover_time);
        for (const expedition of NoteData.expeditions) {
            expedition.avatars = expedition.avatars.map((avatar) => getNotePath(avatar));
            expedition.remaining_time = await FormatTime(expedition.remaining_time);
        }
        return {
            saveId: NoteData.uid,
            uid: NoteData.uid,
            tplFile: `${_path}/plugins/Honkai-StarRail/resources/html/Note/Note.html`,
            pluResPath: `${_path}/plugins/Honkai-StarRail/resources/`,
            ...NoteData
        };
    }

}

function getNotePath(imageUrl) {
    const imageName = imageUrl.split('/').pop();
    return _path + '/plugins/Honkai-StarRail/resources/img/RoleAvatar/' + imageName
}
