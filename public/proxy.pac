// if (isPlainHostName(host)) return "DIRECT";
// if (dnsDomainIs(host, ".google.com")) return "DIRECT";
// if (localHostOrDomainIs(host, "www.google.com")) return "DIRECT";
// if (isResolvable(host)) return "PROXY proxy1.example.com:8080";
// if (isInNet(host, "172.16.0.0", "255.240.0.0")) return "DIRECT";
// var resolved_ip = dnsResolve(host);
// if (isInNet(myIpAddress(), "10.10.1.0", "255.255.255.0")) return "DIRECT";
// if (dnsDomainLevels(host) > 0) return "PROXY proxy1.example.com:8080";
// if (shExpMatch(url, "*vpn.domain.com*") ||
//	shExpMatch(url, "*abcdomain.com/folder/*")) return "DIRECT";
// if (weekdayRange("MON", "FRI")) return "PROXY proxy1.example.com:8080";
//	else return "DIRECT";
// if (dateRange("JAN", "MAR")) return "PROXY proxy1.example.com:8080";
//	else return "DIRECT";
// if (timeRange(8, 18)) return "PROXY proxy1.example.com:8080";
//	else return "DIRECT";

function FindProxyForURL(url, host) {
    var ret = null;
    var hostIp = dnsResolve(host);
    if ( shExpMatch(url, 'https') ) {
        ret = 'DIRECT';
    } else {
        if ( isInNet(myIpAddress(), "172.16.0.0", "255.255.0.0") ||
             isInNet(myIpAddress(), "218.158.4.148", "255.255.255.255") ) {
            if ( !isInNet(hostIp, "218.158.4.96", "255.255.255.224") &&
                 !isInNet(hostIp, "218.158.4.128", "255.255.255.224") ) {
                ret = 'PROXY home1.dgkim.net:3128;DIRECT';
            }
        }
    }
    return ret;
}
