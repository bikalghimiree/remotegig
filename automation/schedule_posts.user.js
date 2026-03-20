// ==UserScript==
// @name         RemoteGig X Post Scheduler
// @namespace    remotegig
// @version      1.0
// @description  Bulk schedule posts on X.com for RemoteGig
// @match        https://x.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // ============ YOUR POSTS (20 total: 15 Data + 5 Other) ============
  const POST_TEMPLATES = [

    // --- DATA JOBS (15) ---

    `🟢 HIRING REMOTELY

Role: Director Analyst – Data Analytics
Company: Gartner
Salary: $148,000 - $175,500/yr
Location: 🌎 Remote

• Lead procure-to-pay & master data analytics
• SAP, Oracle, Informatica expertise required

Comment "APPLY" and we'll send you the direct link 👇
https://remotegig.pro/=jobs

#remotejobs #dataanalyst #hiring #remotework`,

    `🟢 HIRING REMOTELY

Role: Data Analyst
Company: Forbes
Salary: $85,000 - $90,000/yr
Location: 🌎 Remote

• Own analytical projects & deliver actionable insights
• SQL, data visualization, 1-3 yrs experience

Comment "APPLY" for the direct link 👇
https://remotegig.pro/=jobs

#remotejobs #dataanalyst #hiring #remotework`,

    `🟢 HIRING REMOTELY

Role: Junior Data Analyst
Company: FiscalNote
Salary: $67K – $90K/yr
Location: 🌎 Remote

• Support global data collection & forecasting
• Excel, R, Python, SQL, Tableau

Comment "APPLY" and we'll send the link 👇
https://remotegig.pro/=jobs

#remotejobs #datajobs #juniorjobs #hiring`,

    `🟢 HIRING REMOTELY

Role: Data & AI Analyst
Company: Accenture Federal Services
Salary: $61,700 - $109,400/yr
Location: 🌎 Remote

• Design & maintain data pipelines
• Machine learning + cloud platforms + BI tools

Comment "APPLY" for the direct link 👇
https://remotegig.pro/=jobs

#remotejobs #dataanalyst #AI #hiring`,

    `🟢 HIRING REMOTELY

Role: Data Analyst
Company: Flipp
Salary: $76,000 - $80,000/yr
Location: 🌎 Remote

• Build dashboards & measurement frameworks
• SQL, Python, Tableau required

Comment "APPLY" and we'll send you the link 👇
https://remotegig.pro/=jobs

#remotejobs #dataanalyst #hiring #remotework`,

    `🟢 HIRING REMOTELY

Role: Business Intelligence Analyst
Company: Providence
Salary: $39.67 - $61.58/hr
Location: 🌎 Remote

• Design & manage BI solutions
• SQL, data visualization, data warehouse design

Comment "APPLY" for the direct link 👇
https://remotegig.pro/=jobs

#remotejobs #datajobs #BI #hiring`,

    `🟢 HIRING REMOTELY

Role: Data Analyst
Company: NMI
Salary: $32.69 - $39.90/hr
Location: 🌎 Remote

• Full-cycle CRM implementation
• Excel modeling, SQL, cross-functional collaboration

Comment "APPLY" and we'll send the link 👇
https://remotegig.pro/=jobs

#remotejobs #dataanalyst #hiring #remotework`,

    `🟢 HIRING REMOTELY

Role: Data Analyst
Company: DWX
Salary: $40/hr
Location: 🌎 Remote

• Build automated data solutions
• Microsoft analytics tools, supplier management

Comment "APPLY" for the direct link 👇
https://remotegig.pro/=jobs

#remotejobs #dataanalyst #contract #hiring`,

    `🟢 HIRING REMOTELY

Role: Data Entry
Company: The Hartford
Salary: $46,222 - $69,333/yr
Location: 🌎 Remote

• Manage high-volume insurance transactions
• Prepare new business issues & consolidate quotes

Comment "APPLY" and we'll send you the link 👇
https://remotegig.pro/=jobs

#remotejobs #dataentry #hiring #remotework`,

    `🟢 HIRING REMOTELY

Role: Data Entry Specialist
Company: Talentmate
Salary: $1,000 - $1,500/mo
Location: 🌎 Remote

• Input & maintain business data accurately
• Google Sheets, Excel, US time zones

Comment "APPLY" for the direct link 👇
https://remotegig.pro/=jobs

#remotejobs #dataentry #hiring #workfromhome`,

    `🟢 HIRING REMOTELY

Role: Data Entry Clerk
Company: Anova Care
Salary: $23 - $27/hr
Location: 🌎 Remote

• Manage account updates & payment processing
• Document transactions & resolve discrepancies

Comment "APPLY" and we'll send the link 👇
https://remotegig.pro/=jobs

#remotejobs #dataentry #hiring #remotework`,

    `🟢 HIRING REMOTELY

Role: Business Operations – Data Entry
Company: Mindlance
Salary: $16/hr
Location: 🌎 Remote

• Process requests, claims & admin tasks
• 1yr data entry experience, strong typing speed

Comment "APPLY" for the direct link 👇
https://remotegig.pro/=jobs

#remotejobs #dataentry #hiring #workfromhome`,

    `🟢 HIRING REMOTELY

Role: Data Analyst – Energy Efficiency
Company: CLEAResult
Salary: $23 - $33/hr
Location: 🌎 Remote

• Data analysis, modeling & automation
• Excel, Visual Basic, Smartsheet

Comment "APPLY" and we'll send the link 👇
https://remotegig.pro/=jobs

#remotejobs #dataanalyst #energy #hiring`,

    `🟢 HIRING REMOTELY

Role: Data Quality Engineer Intern
Company: Abacus Insights
Salary: $22 - $31/hr
Location: 🌎 Remote

• Test & validate healthcare data pipelines
• AWS, PySpark, SQL

Comment "APPLY" for the direct link 👇
https://remotegig.pro/=jobs

#remotejobs #datajobs #internship #hiring`,

    `🟢 HIRING REMOTELY

Role: Business Analyst Intern
Company: Calo Inc.
Salary: $21/hr
Location: 🌎 Remote

• Support BI & product teams with data analysis
• Build dashboards & automate reporting

Comment "APPLY" and we'll send the link 👇
https://remotegig.pro/=jobs

#remotejobs #dataanalyst #internship #hiring`,

    // --- OTHER JOBS (5) ---

    `🟢 HIRING REMOTELY

Role: Software Engineer – React
Company: Metal Toad
Salary: $104K - $156K/yr
Location: 🌎 Remote

• Build scalable enterprise-grade React apps
• Full dev lifecycle, TDD/BDD, code reviews

Comment "APPLY" for the direct link 👇
https://remotegig.pro/=jobs

#remotejobs #softwareengineer #react #hiring`,

    `🟢 HIRING REMOTELY

Role: Software Engineer, Front End
Company: Camunda
Salary: $119,900 - $193,200/yr
Location: 🌎 Remote

• Build enterprise modeling tools
• JavaScript, web development, user-centered design

Comment "APPLY" and we'll send the link 👇
https://remotegig.pro/=jobs

#remotejobs #frontend #hiring #remotework`,

    `🟢 HIRING REMOTELY

Role: Product Data Analyst
Company: Clover Health
Salary: $150,000 - $175,000/yr
Location: 🌎 Remote

• Define product metrics, build dashboards, run experiments
• SQL, Python, product analytics

Comment "APPLY" for the direct link 👇
https://remotegig.pro/=jobs

#remotejobs #productanalyst #hiring #remotework`,

    `🟢 HIRING REMOTELY

Role: QA Automation Engineer
Company: Upshop
Salary: $56/hr
Location: 🌎 Remote

• Design end-to-end & API automated tests
• Cypress, WebDriverIO, JavaScript/TypeScript

Comment "APPLY" and we'll send the link 👇
https://remotegig.pro/=jobs

#remotejobs #QA #automation #hiring`,

    `🟢 HIRING REMOTELY

Role: Backend & Frontend Developer
Company: Base360.ai
Salary: $56/hr
Location: 🌎 Remote

• Design scalable backend services & dashboards
• APIs, real-time microservices, third-party integrations

Comment "APPLY" for the direct link 👇
https://remotegig.pro/=jobs

#remotejobs #fullstack #developer #hiring`,

  ];

  // Generate posts at random times from 7:00 AM to 10:00 PM TOMORROW
  function generateSchedule() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = tomorrow.getMonth() + 1;
    const day = tomorrow.getDate();
    const TARGET_POSTS = POST_TEMPLATES.length;

    if (TARGET_POSTS === 0) {
      alert('⚠️ No posts added! Edit the POST_TEMPLATES array first.');
      return [];
    }

    const startMin = 7 * 60; // 7:00 AM
    const endMin = 22 * 60 - 1; // 9:59 PM
    const times = [];

    for (let i = 0; i < TARGET_POSTS; i++) {
      let t;
      let attempts = 0;
      do {
        t = startMin + Math.floor(Math.random() * (endMin - startMin));
        attempts++;
      } while (times.some(x => Math.abs(x - t) < 15) && attempts < 100);
      times.push(t);
    }
    times.sort((a, b) => a - b);

    return times.map((t, i) => {
      const hour24 = Math.floor(t / 60);
      const min = t % 60;
      const h = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
      const ampm = hour24 >= 12 ? 'pm' : 'am';
      return {
        text: POST_TEMPLATES[i % POST_TEMPLATES.length],
        month: String(month),
        day: String(day),
        year: String(year),
        hour: String(h),
        minute: String(min),
        ampm,
      };
    });
  }

  // ============ HELPERS ============
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let STOP = false;

  function setSelectValue(select, value) {
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;

    for (let attempt = 0; attempt < 3; attempt++) {
      nativeSetter.call(select, String(value));
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));

      if (select.value === String(value)) {
        console.log(`  ✅ ${select.id} = ${value} (attempt ${attempt + 1})`);
        return true;
      }
      console.warn(`  ⚠️ ${select.id} expected "${value}" but got "${select.value}", retrying...`);
    }
    console.error(`  ❌ ${select.id} failed to set to "${value}" after 3 attempts`);
    return false;
  }

  function setScheduleDateTime(post) {
    const selects = document.querySelectorAll('select');
    if (selects.length < 6) {
      console.error(`❌ Expected 6 selects, found ${selects.length}`);
      return false;
    }

    const offset = selects.length - 6;
    const values = [post.month, post.day, post.year, post.hour, post.minute, post.ampm];
    const labels = ['Month', 'Day', 'Year', 'Hour', 'Minute', 'AM/PM'];

    let allOk = true;
    for (let i = 0; i < 6; i++) {
      console.log(`  Setting ${labels[i]}...`);
      if (!setSelectValue(selects[offset + i], values[i])) {
        allOk = false;
      }
    }

    console.log('  --- Verifying all values ---');
    for (let i = 0; i < 6; i++) {
      const actual = selects[offset + i].value;
      const expected = String(values[i]);
      if (actual !== expected) {
        console.error(`  ❌ ${labels[i]}: expected "${expected}" got "${actual}"`);
        setSelectValue(selects[offset + i], values[i]);
        allOk = false;
      } else {
        console.log(`  ✅ ${labels[i]}: ${actual}`);
      }
    }

    return allOk;
  }

  async function schedulePost(post, index, total) {
    if (STOP) return false;
    console.log(`📝 [${index + 1}/${total}] Scheduling for ${post.month}/${post.day} ${post.hour}:${post.minute} ${post.ampm}`);
    console.log(`   Text: ${post.text.substring(0, 60)}...`);

    const closeBtn = document.querySelector('[data-testid="app-bar-close"]') ||
                     document.querySelector('[aria-label="Close"]');
    if (closeBtn) {
      closeBtn.click();
      await sleep(500);
      const discardBtn = [...document.querySelectorAll('[role="button"]')].find(b => b.textContent?.trim() === 'Discard');
      if (discardBtn) {
        discardBtn.click();
        await sleep(500);
      }
    }

    const composeBtn = document.querySelector('[data-testid="SideNav_NewTweet_Button"]') ||
                       document.querySelector('a[href="/compose/post"]');

    if (!composeBtn) {
      console.error('❌ Could not find compose button');
      return false;
    }
    composeBtn.click();
    await sleep(1500);

    if (STOP) return false;

    let textBox = null;
    for (let i = 0; i < 20; i++) {
      textBox = document.querySelector('[data-testid="tweetTextarea_0"]');
      if (textBox) break;
      await sleep(200);
    }
    if (!textBox) {
      console.error('❌ Could not find text box');
      return false;
    }

    textBox.focus();
    await sleep(200);

    try {
      await navigator.clipboard.writeText(post.text);
      const dt = new DataTransfer();
      dt.setData('text/plain', post.text);
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: dt,
        bubbles: true,
        cancelable: true,
      });
      textBox.dispatchEvent(pasteEvent);
    } catch {
      console.warn('Clipboard failed, using insertText fallback');
      const lines = post.text.split('\n');
      for (const line of lines) {
        document.execCommand('insertText', false, line);
        document.execCommand('insertText', false, '\n');
      }
    }
    await sleep(800);

    if (STOP) return false;

    let scheduleIcon = document.querySelector('[aria-label*="Schedule"], [data-testid*="schedule"]');
    if (!scheduleIcon) {
      scheduleIcon = document.evaluate(
        '//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div/div[3]/div[2]/div[1]/div/div/div/div[2]/div[2]/div/div/nav/div/div[2]/div/div[6]/button',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
      ).singleNodeValue;
    }

    if (!scheduleIcon) {
      console.error('❌ Could not find schedule icon');
      return false;
    }
    scheduleIcon.click();
    await sleep(1000);

    if (STOP) return false;

    setScheduleDateTime(post);
    await sleep(500);

    if (STOP) return false;

    const buttons = document.querySelectorAll('[role="dialog"] button, [aria-modal="true"] button');
    const confirmBtn = [...buttons].find((btn) => btn.textContent?.trim() === 'Confirm');
    if (confirmBtn) {
      confirmBtn.click();
      console.log('✅ Confirmed schedule');
    } else {
      console.error('❌ Could not find Confirm button');
      return false;
    }
    await sleep(1000);

    if (STOP) return false;

    const postBtn = document.querySelector('[data-testid="tweetButton"]');
    if (postBtn) {
      postBtn.click();
      console.log('✅ Post scheduled!');
    }

    await sleep(2000);
    return true;
  }

  // ============ UI ============
  const btn = document.createElement('button');
  btn.textContent = '📅 RemoteGig Schedule (20)';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;padding:12px 24px;background:#006145;color:white;border:none;border-radius:30px;font-size:16px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);';

  btn.onclick = async () => {
    if (btn.textContent.includes('Stop')) {
      STOP = true;
      btn.textContent = '⏸ Stopping...';
      btn.style.background = '#666';
      return;
    }

    STOP = false;
    btn.textContent = '🛑 Stop';
    btn.style.background = '#e0245e';

    const posts = generateSchedule();
    if (posts.length === 0) {
      btn.textContent = '📅 RemoteGig Schedule (20)';
      btn.style.background = '#006145';
      return;
    }

    console.log(`🚀 Scheduling ${posts.length} posts...`);
    console.log('Posts:', posts.map(p => `${p.hour}:${p.minute} ${p.ampm} - ${p.text.substring(0, 50)}...`));

    let success = 0;
    for (let i = 0; i < posts.length; i++) {
      if (STOP) {
        console.log('⏸ Stopped by user');
        break;
      }
      const ok = await schedulePost(posts[i], i, posts.length);
      if (ok) success++;
      else console.warn(`⚠️ Post ${i + 1} may have failed`);
    }

    console.log(`\n🎉 Done! ${success}/${posts.length} posts scheduled`);
    btn.textContent = `✅ Done (${success}/${posts.length})`;
    btn.style.background = '#17bf63';
    setTimeout(() => {
      btn.textContent = '📅 RemoteGig Schedule (20)';
      btn.style.background = '#006145';
    }, 5000);
  };

  document.body.appendChild(btn);
})();
