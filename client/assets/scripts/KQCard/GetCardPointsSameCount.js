/*#####*/
//��������һ���������ڵ���ͬ�������Ƶ�����
 var GetCardPointsSameCount = function (cards) {
    this.cardNumbers = {};
    for(var i in cards){
        var s;
        if(typeof(cards[i].number) == 'undefined'){
            s = cards[i].point;
        }else{
            s = cards[i].number;
        }
        if(this.cardNumbers[s]){
            this.cardNumbers[s] ++;
        }else{
            this.cardNumbers[s] = 1;
        }
        //cc.log(this.cardNumbers[cards[i].number])
        //cc.log(cards)
        //cc.log(cards[i].number)
        //cc.log('---7')
    }
    return this.cardNumbers;
};

module.exports = GetCardPointsSameCount;
