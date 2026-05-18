import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import CreativeFactoryPage from '@/app/factory/creative/page';
import { CreativeMonitoringConsoleClient } from '@/components/CreativeMonitoringConsoleClient';

describe('creative monitoring console page', () => {
  it('renders the creative factory as a Chinese operator console', async () => {
    const page = await CreativeFactoryPage({
      searchParams: Promise.resolve({ projectId: 'creative-launch' }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('创意情报台');
    expect(html).toContain('竞品账号、榜单和视频拆解监控');
    expect(html).toContain('写入监控清单');
    expect(html).toContain('补齐三类监控');
    expect(html).toContain('结算到期采集');
    expect(html).toContain('采集器执行清单');
    expect(html).toContain('回灌采集器结果');
    expect(html).toContain('写入采集运行');
    expect(html).toContain('创意机会地图');
    expect(html).toContain('可复用打法簇');
    expect(html).toContain('护城河分');
    expect(html).toContain('生成脚本与分发计划');
    expect(html).toContain('采集器接入状态');
    expect(html).toContain('Hookshot / Hookly 参考层');
    expect(html).toContain('可复用广告结构库');
    expect(html).toContain('Hook Bank');
    expect(html).toContain('UGC Script Spine');
    expect(html).toContain('Offer Test Matrix');
    expect(html).toContain('Compose Intelligence Stack');
    expect(html).toContain('全网灵感管理');
    expect(html).toContain('热门视频解析');
    expect(html).toContain('把灵感、视频、Hook 和投放假设串成一条生产约束链');
    expect(html).toContain('不是只保存素材');
    expect(html).toContain('内部可做');
    expect(html).toContain('外部需要');
    expect(html).toContain('creative-launch');
  });

  it('states the manual authorization boundary instead of pretending automatic scraping', () => {
    const html = renderToStaticMarkup(<CreativeMonitoringConsoleClient initialProjectId="creative-project" />);

    expect(html).toContain('当前不伪装未授权自动抓取');
    expect(html).toContain('只提取结构，不复制表达');
    expect(html).toContain('竞品账号');
    expect(html).toContain('榜单趋势');
    expect(html).toContain('视频关键词');
    expect(html).toContain('暂无机会地图');
    expect(html).toContain('暂无可复用打法簇');
    expect(html).toContain('系统才会把它升级成可复用打法');
    expect(html).toContain('先导入竞品账号、榜单或视频拆解信号');
    expect(html).toContain('只导入公开可用或已授权观察');
    expect(html).toContain('只复用结构和验证逻辑');
    expect(html).toContain('没有广告账户和 analytics sync 前，只能生成投放方案');
    expect(html).toContain('平台授权、榜单/视频数据源、合法抓取或官方 API');
    expect(html).toContain('多模态视频解析 provider、素材授权、下载/存储权限');
    expect(html).toContain('投放回流和真实转化数据，验证哪个 hook 真正胜出');
    expect(html).toContain('广告账户授权、自动建计划、平台 analytics sync');
    expect(html).toContain('开头钩子');
    expect(html).toContain('空结果只记录缺口，不生成洞察');
    expect(html).toContain('当前继续走人工运营回灌，不假装已完成未授权自动抓取。');
    expect(html).not.toContain('provider-gated');
    expect(html).not.toContain('automation-ready');
    expect(html).not.toContain('Manifest');
  });
});
