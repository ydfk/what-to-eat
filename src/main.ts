import dayjs from "dayjs";
import ChatBot from "dingtalk-robot-sender";
import http from "http";
import schedule from "node-schedule";

const scheduleCronstyle = () => {
  const corn = "0 35 11 * * ? ";
  //// const corn = "0/1 * * * * ? ";
  schedule.scheduleJob(corn, () => {
    console.log("send to dingTalk: " + new Date());
    sendToDingTalk();
  });
};

scheduleCronstyle();

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log("get eat");
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.write(whatToEat());
    res.end();
  }
);

const sendToDingTalk = async () => {
  const dayOfWeek = getWeek();
  if (dayOfWeek != 6 && dayOfWeek != 7) {
    const robot = new ChatBot({
      webhook:
        "https://oapi.dingtalk.com/robot/send?access_token=497f625dc9c06c56b95c2ceb015ec29fed64dcb2eea5fb5972c3d37ad1dcb5f6"
    });

    const text = whatToEat(true);

    const res = await robot.markdown("今天吃什么", text, {
      atMobiles: ["18612689916", "15929983470", "15229025681"],
      isAtAll: true
    });

    const result = `结果${res.status}, 内容${res.statusText}`;
    console.log(result);
  } else {
    console.log("周末不吃饭");
  }
};

const whatToEat = (isDingTalk?: boolean): string => {
  const nowTime = dayjs().format("YYYY年MM月DD日 HH:mm:ss");
  const week = getWeek();
  const msg = isDingTalk
    ? `### 今天吃什么 \n #### 现在是${nowTime}, 星期${week} \n # 要吃【**${getFood()}**】`
    : `现在是${nowTime}, 星期${week}, 要吃【${getFood()}】`;

  console.log(msg);
  return msg;
};

const getWeek = (): number => {
  const dayOfWeek = dayjs().day();
  return dayOfWeek === 0 ? 7 : dayOfWeek;
};

const getFood = (): string => {
  let eat = "今天不吃饭";
  switch (getWeek()) {
    case 1:
      eat = "微面馆臊子肉夹馍+擀面皮";
      break;
    case 2:
      eat = "小板凳粽子+稀饭+菜夹馍";
      break;
    case 3:
      eat = "负一楼辛拉面";
      break;
    case 4:
      eat = "揪面片";
      break;
    case 5:
      eat = "拉面/小杨烤肉？";
      break;
  }

  return eat;
};

server.listen(9321, () => {
  console.log("Server listening on port 9321");
});
