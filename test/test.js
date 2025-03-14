import WebTorrent from 'webtorrent';
import fs from 'fs';

const client = new WebTorrent();
const magnet = 'magnet:?xt=urn:btih:YQDXDDMZHL6DFTPIVPOQZ5YLQKP6FRFB';
const trackList = [
  'udp://104.143.10.186:8000/announce',
  'http://tracker.openbittorrent.com:80/announce',
  'http://tracker3.itzmx.com:6961/announce',
  'http://tracker4.itzmx.com:2710/announce',
  'http://tracker.publicbt.com:80/announce',
];

client.add(magnet, { announce: trackList }, (torrent) => {
  console.log(`Torrent metadata received: ${torrent.name}`);
  // 将种子信息写入 `.torrent` 文件
  console.log(torrent.files);
  // const torrentFile = torrent.torrentFile;
  // fs.writeFileSync(`${torrent.name}.torrent`, torrentFile);

  console.log(`.torrent file saved as ${torrent.name}.torrent`);
  client.destroy(); // 关闭 WebTorrent 客户端
});
